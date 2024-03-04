import { publish as _publish, IPublishOptions } from './publish';
import { packageCommand, listFiles as _listFiles, IPackageOptions } from './package';

/**
 * @deprecated prefer IPackageOptions instead
 * @public
 */
export type IBaseREXOptions = Pick<
	IPackageOptions,
	'baseContentUrl' | 'baseImagesUrl' | 'githubBranch' | 'gitlabBranch' | 'useYarn' | 'target' | 'preRelease'
>;

/**
 * @deprecated prefer IPackageOptions instead
 * @public
 */
export type ICreateREXOptions = Pick<IPackageOptions, 'cwd' | 'packagePath'> & IBaseREXOptions;

/**
 * The supported list of package managers.
 * @public
 */
export enum PackageManager {
	Npm,
	Yarn,
	None,
}

/**
 * Options for the `listFiles` function.
 * @public
 */
export interface IListFilesOptions {
	/**
	 * The working directory of the extension. Defaults to `process.cwd()`.
	 */
	cwd?: string;

	/**
	 * The package manager to use. Defaults to `PackageManager.Npm`.
	 */
	packageManager?: PackageManager;

	/**
	 * A subset of the top level dependencies which should be included. The
	 * default is `undefined` which include all dependencies, an empty array means
	 * no dependencies will be included.
	 */
	packagedDependencies?: string[];

	/**
	 * The location of an alternative .ruigignore file to be used.
	 * The `.ruigignore` file located at the root of the project will be taken
	 * instead, if none is specified.
	 */
	ignoreFile?: string;
}

export type { IPackageOptions } from './package';

/**
 * Creates a REX from the extension in the current working directory.
 * @public
 */
export function createREX(options: IPackageOptions = {}): Promise<any> {
	return packageCommand(options);
}

export type { IPublishOptions } from './publish';

/**
 * Publishes the extension in the current working directory.
 * @public
 */
export function publish(options: IPublishOptions = {}): Promise<any> {
	return _publish(options);
}

/**
 * Lists the files included in the extension's package.
 * @public
 */
export function listFiles(options: IListFilesOptions = {}): Promise<string[]> {
	return _listFiles({
		...options,
		useYarn: options.packageManager === PackageManager.Yarn,
		dependencies: options.packageManager !== PackageManager.None,
	});
}

/**
 * Options for the `publishREX` function.
 * @public
 */
export type IPublishREXOptions = IPublishOptions & Pick<IPackageOptions, 'target'>;

/**
 * Publishes a pre-build REX.
 * @public
 */
export function publishREX(packagePath: string | string[], options: IPublishREXOptions = {}): Promise<any> {
	return _publish({
		packagePath: typeof packagePath === 'string' ? [packagePath] : packagePath,
		...options,
		targets: typeof options.target === 'string' ? [options.target] : undefined,
		...{ target: undefined },
	});
}
