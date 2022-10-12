import {
  ExecutorContext,
  logger,
  parseTargetString,
  readTargetOptions,
  runExecutor,
  TargetConfiguration,
} from '@nrwl/devkit';
import { RunCommandsOptions } from 'nx/src/executors/run-commands/run-commands.impl';
import { CopyFile, CopyPattern } from 'ng-cli-packagr-tasks/dist/tasks/copy-file';

import { GhPagesExecutorSchema } from './schema';

export default async function executor(options: GhPagesExecutorSchema, context: ExecutorContext) {
  logger.info('Executor ran for GhPages');
  const buildTarget =  parseTargetString(options.buildTarget);
  const buildProject = readTargetOptions(buildTarget, context);

  const steps: { title: string, disabled?: boolean, factory: () => Promise<AsyncIterableIterator<{ success: boolean; }>> }[] = [
    {
      title: ` - Executing Client Build: ${options.buildTarget}`,
      factory: () => runExecutor(buildTarget, { baseHref: `/${options.baseHref}/` }, context)
    },
    {
      title: ` - Executing Server Build: ${options.serverTarget}`,
      factory: () => runExecutor(parseTargetString(options.serverTarget), { bundleDependencies: "all" }, context)
    },
    {
      title: `- Executing: SSR pre-cache page rendering`,
      factory: () => runExecutor({project: context.projectName, target: createSsrCompilerTarget(options, context)}, {}, context)
    },
    {
      title: `- Executing: Copy Assets`,
      disabled: (options.assets?.length ?? 0) == 0,
      factory: () => executeCopyAssets(options, context)
    },
    {
      title: `- Executing: Local GH Server`,
      disabled: options.runLocalServer !== true,
      factory: () => runExecutor({project: context.projectName, target: createLocalGhServerTarget(options, context, buildProject.outputPath)}, {}, context)
    },
  ];

  for (var step of steps)
  {
    if (step.disabled === true) {
      continue;
    }
    
    logger.info(step.title);

    for await (const res of  await step.factory()) {
      if (!res.success) return res;
    }
  }
  return { success: true };
}

async function executeCopyAssets(options: GhPagesExecutorSchema, context: ExecutorContext) {
  return (async function* () {
    const projectMeta = context.workspace.projects[context.projectName];
  
    const copyPatterns = CopyFile.createCopyPatterns(options.assets, context.root, projectMeta.root, projectMeta.sourceRoot);
    
    const copyOptions = { ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'] };
    const onCopy = (pattern: CopyPattern, from: string, to: string) => {
      logger.info(` - from: ${from}`);
      logger.info(` - to: ${to}`);
    };
  
    console.info('Copying assets:');
  
    try {
      await CopyFile.executeCopyPatterns(copyPatterns, context.root, copyOptions, onCopy);
      yield { success: true };
    } catch (err) {
      logger.error(err);
      yield { success: false };
    }
  })();
}

function createSsrCompilerTarget(options: GhPagesExecutorSchema, context: ExecutorContext)
{
  return adHocTarget<RunCommandsOptions>("ssr-webpack", context, {
    executor: "nx:run-commands",
      options: {
          commands: [
            `./node_modules/.bin/webpack --config ${options.ssrWebpackConfig} --color`,
            `node ${options.ssrProccessingScript}`,
          ],
          parallel: false,
          __unparsed__: [],
      } 
  });
}

function createLocalGhServerTarget(options: GhPagesExecutorSchema, context: ExecutorContext, outputPath: string)
{
  return adHocTarget<RunCommandsOptions>("local-gh-server", context, {
    executor: "nx:run-commands",
      options: {
          commands: [
            `npx light-server -s ${outputPath} --historyindex /${options.baseHref}/index.html --servePrefix /${options.baseHref}`,
            `node ${options.ssrProccessingScript}`,
          ],
          parallel: false,
          __unparsed__: [],
      } 
  });
}

function adHocTarget<T = any>(targetName: string, context: ExecutorContext, config: TargetConfiguration<T>): string
{
  var actualName = `${targetName}_${new Date().getTime()}`;
  context.workspace.projects[context.projectName].targets[actualName] = config;
  return actualName;
}
