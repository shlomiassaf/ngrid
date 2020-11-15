import {
  Component,
  InjectionToken,
  Inject,
  OnDestroy,
} from '@angular/core';

import { utils } from '@pebula/ngrid';
import { MarkdownDynamicComponentPortal } from '../markdown-dynamic-component-portal';

export const CONTENT_CHUNKS_COMPONENTS = new InjectionToken('CONTENT_CHUNKS_COMPONENTS');

export interface LiveContentChunk {
  title: string;
  component: any;
  additionalFiles?: string[];
  selectorName?: string;
}

@Component({
  selector: 'pbl-content-chunk-view',
  templateUrl: './content-chunk-view.component.html',
  styleUrls: ['./content-chunk-view.component.scss']
})
export class ContentChunkViewComponent extends MarkdownDynamicComponentPortal implements OnDestroy {
  contentChunkData: LiveContentChunk;

  constructor(@Inject(CONTENT_CHUNKS_COMPONENTS) private contentChunks: {[key: string]: LiveContentChunk} ) { super(); }

  getRenderTypes(selector: string) {
    this.contentChunkData = this.contentChunks[selector];
    return this.contentChunkData;
  }

  ngOnDestroy(): void {
    utils.unrx.kill(this);
  }
}
