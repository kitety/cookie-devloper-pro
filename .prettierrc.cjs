/** @type {import("prettier").Config} */
const prettierConfig = {
  /**
    * Print semicolons at the ends of statements.
    * @default true
    */
  semi: false,
  /**
   * Use single quotes instead of double quotes.
   * @default false
   */
  singleQuote: true,
  /**
   * Use single quotes in JSX.
   * @default false
   */
  jsxSingleQuote: true,
  /**
   * Print trailing commas wherever possible.
   * @default 'es5'
   */
  trailingComma: 'es5',
  /**
   * Print spaces between brackets in object literals.
   * @default true
   */
  bracketSpacing: true,
  /**
   * Put the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being
   * alone on the next line (does not apply to self closing elements).
   * @default false
   */
  bracketSameLine: false,
  /**
   * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
   * @default false
   * @deprecated use bracketSameLine instead
   */
  jsxBracketSameLine: false,
  /**
   * Format only a segment of a file.
   * @default 0
   */
  rangeStart: 0,
  /**
   * Format only a segment of a file.
   * @default Infinity
   */
  rangeEnd: Infinity,
  /**
   * Specify which parser to use.
   */
  // parser: LiteralUnion < BuiltInParserName > | CustomParser;
  /**
   * Specify the input filepath. This will be used to do parser inference.
   */
  // filepath: string;
  /**
   * Prettier can restrict itself to only format files that contain a special comment, called a pragma, at the top of the file.
   * This is very useful when gradually transitioning large, unformatted codebases to prettier.
   * @default false
   */
  requirePragma: false,
  /**
   * Prettier can insert a special @format marker at the top of files specifying that
   * the file has been formatted with prettier. This works well when used in tandem with
   * the --require-pragma option. If there is already a docblock at the top of
   * the file then this option will add a newline to it with the @format marker.
   * @default false
   */
  insertPragma: false,
  /**
   * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
   * In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
   * @default 'preserve'
   */
  proseWrap: 'preserve',
  /**
   * Include parentheses around a sole arrow function parameter.
   * @default 'always'
   */
  arrowParens: 'always',
  /**
   * Provide ability to support new languages to prettier.
   */
  // plugins: Array < string | Plugin >;
  /**
   * Specify plugin directory paths to search for plugins if not installed in the same `node_modules` where prettier is located.
   */
  // pluginSearchDirs: string[] | false;
  /**
   * How to handle whitespaces in HTML.
   * @default 'css'
   */
  htmlWhitespaceSensitivity: 'css',
  /**
   * Which end of line characters to apply.
   * @default 'lf'
   */
  endOfLine: 'lf',
  /**
   * Change when properties in objects are quoted.
   * @default 'as-needed'
   */
  quoteProps: 'as-needed',
  /**
   * Whether or not to indent the code inside <script> and <style> tags in Vue files.
   * @default false
   */
  vueIndentScriptAndStyle: false,
  /**
   * Control whether Prettier formats quoted code embedded in the file.
   * @default 'auto'
   */
  embeddedLanguageFormatting: 'auto',
  /**
   * Enforce single attribute per line in HTML, Vue and JSX.
   * @default false
   */
  singleAttributePerLine: true
}

module.exports = prettierConfig
