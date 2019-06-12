/** Regular expression that matches version names and the individual version segments. */
const versionNameRegex = /^(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d)+)?$/;

export class Version {
  constructor(
      /** Major version number */
      public major: number,
      /** Minor version number */
      public minor: number,
      /** Patch version number */
      public patch: number,
      /** Pre-release label for the version (e.g. alpha, beta, rc) */
      public prereleaseLabel: string|null,
      /** Number for the pre-release. There can be multiple pre-releases for a version. */
      public prereleaseNumber: number|null) {}

  /** Serializes the version info into a string formatted version name. */
  format(): string {
    return serializeVersion(this);
  }

  clone(): Version {
    return new Version(
        this.major, this.minor, this.patch, this.prereleaseLabel, this.prereleaseNumber);
  }

  equals(other: Version): boolean {
    return this.major === other.major && this.minor === other.minor && this.patch === other.patch &&
        this.prereleaseLabel === other.prereleaseLabel &&
        this.prereleaseNumber === other.prereleaseNumber;
  }
}

/**
 * Parses the specified version and returns an object that represents the individual
 * version segments.
 */
export function parseVersionName(version: string): Version|null {
  const matches = version.match(versionNameRegex);

  if (!matches) {
    return null;
  }

  return new Version(
      Number(matches[1]), Number(matches[2]), Number(matches[3]), matches[4] || null,
      Number(matches[5]) || null);
}

/** Serializes the specified version into a string. */
export function serializeVersion(newVersion: Version): string {
  const {major, minor, patch, prereleaseLabel, prereleaseNumber} = newVersion;

  let versionString = `${major}.${minor}.${patch}`;

  if (prereleaseLabel && prereleaseNumber !== null) {
    versionString += `-${prereleaseLabel}.${prereleaseNumber}`;
  }

  return versionString;
}
