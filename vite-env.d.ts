/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
    readonly VITE_APIKEY: string
    readonly VITE_AUTHDOMAIN: string
    readonly VITE_PROJECTID: string
    readonly VITE_STORAGEBUCKET: string
    readonly VITE_MESSAGESENDERID: string
    readonly VITE_APPID: string
    readonly VITE_GOOGLEAPI:string
    readonly VITE_GEMINI:string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}