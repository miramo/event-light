export = index;
declare function index(hook: any): void;
declare namespace index {
  function forceExitTimeout(ms: any): void;
  function hookEvent(event: any, code: any, filter: any): void;
  function hookedEvents(): any;
  function uncaughtExceptionHandler(hook: any): void;
  function unhandledRejectionHandler(hook: any): void;
  function unhookEvent(event: any): void;
}
