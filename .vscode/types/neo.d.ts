
export const context: Context;

/**
 * Represents the response structure of an operation or request.
 */
export interface Response {
  /** Optional text content of the response. */
  text?: string;
  /** Error message, if any occurred. */
  error?: string;
  /** Indicates whether the operation is completed. */
  done?: boolean;
  /** Indicates whether the response requires confirmation. */
  confirm?: boolean;
  /** Optional command to execute. */
  command?: Command | null;
  /** List of actions to be performed. */
  actions?: Action[];
  /** Additional data returned with the response. */
  data?: Record<string, any>;
}

/**
 * Represents a command to be executed within the system.
 */
export interface Command {
  /** Optional unique identifier for the command. */
  id?: string;
  /** Name of the command. */
  name?: string;
  /** Optional request data for the command. */
  request?: string;
}

/**
 * Represents an action to be performed within the system.
 */
export interface Action {
  /** Name of the action. */
  name?: string;
  /** Type of the action, e.g., "update" or "notify". */
  type: string;
  /** Optional payload data for the action. */
  payload?: any;
  /** Optional identifier for the next action. */
  next?: string;
}

/**
 * Represents a field in a form or data structure.
 */
export interface Field {
  /** The binding key for the field. */
  bind: string;
  /** The value associated with the field. */
  value: any;
  name?: string;
  type?: string;
  props?: Payload;
  children?: any[];
}

export interface Header {
  [key: string]: string[];
}

export interface Payload {
  [key: string]: any;
}

export interface HttpResponseWriter {
  header(): Header;
  write(data: Uint8Array): number | Promise<number>;
  writeHeader(statusCode: number): void;
}

export interface Hijacker {
  Hijack(): [any, any, Error];
}

export interface ResponseWriter extends HttpResponseWriter, Hijacker {
  status(): number;
  size(): number;
  writeString(s: string): number;
  written(): boolean;
  writeHeaderNow(): void;
  pusher(): any;
  Flush(): void;
}

/**
 * Represents the context of an operation or request.
 */
/**
 * Represents the context of an operation or request.
 */
export interface Context {
  /** Session ID，会话ID。 */
  sid: string;
  /** Chat ID，聊天会话标识。 */
  chat_id?: string;
  /** Assistant ID，助手标识。 */
  assistant_id?: string;
  /** CUI 上下文 */
  namespace?: string;
  /** 未来将移除 */
  stack?: string;
  /** 请求中的路径 */
  path?: string;
  /** 表单数据 */
  formdata?: Payload;
  /** 表单字段 */
  field?: Field;
  /** 配置信息 */
  config?: Payload;
  /** 信号 */
  signal?: any;
  /** 请求的区域设置 */
  locale?: string;
  /** 主题 */
  theme?: string;
  /** 静默模式 */
  silent?: boolean;
  /** 请求的客户端类型，如 SDK、Desktop、Web、JSSDK 等，默认是 Web */
  client_type?: string;
  /** 历史记录是否可见，默认值为 true，若为 false，则历史记录不会在 UI 中显示 */
  history_visible?: boolean;
  /** 重试模式 */
  retry?: boolean;
  /** 重试次数 */
  retry_times?: number;
  /** 视觉支持 */
  vision?: boolean;
  /** 搜索支持 */
  search?: boolean;
  /** 知识支持 */
  knowledge?: boolean;
  /** 调用参数 */
  args?: any[];
  // Shared space，不在 JSON 序列化中体现
  sharedSpace?: any; 
}

export interface FileUpload {
  name?: string;
  type?: string;
  size?: number;
  temp_file?: string;
}

export interface Message {
  /** 消息的 ID */
  id?: string;
  /** 消息的工具 ID */
  tool_id?: string;
  /** 文本内容 */
  text?: string;
  /** 类型，如 error, text, plan, table, form, page, file, video, audio, image, markdown, json 等 */
  type?: string;
  /** 类型对应的属性 */
  props?: Payload;
  /** 标记为来自 neo 的已完成消息 */
  done?: boolean;
  /** 标记为来自 neo 的新消息 */
  new?: boolean;
  /** 标记为来自 neo 的增量消息 */
  delta?: boolean;
  /** 前端的会话操作 */
  actions?: Action[];
  /** 文件附件 */
  attachments?: Attachment[];
  /** 角色，如 user, assistant, system 等 */
  role?: string;
  /** 消息的名称 */
  name?: string;
  /** 助手 ID（当角色为 assistant 时） */
  assistant_id?: string;
  /** 助手名称（当角色为 assistant 时） */
  assistant_name?: string;
  /** 助手头像（当角色为 assistant 时） */
  assistant_avatar?: string;
  /** 消息的提及（当角色为 user 时） */
  mentions?: Mention[];
  /** 消息是否处于待处理状态 */
  hidden?: boolean;
  /** 消息是否需要重试 */
  retry?: boolean;
  /** 消息是否静默（不在 UI 和历史记录中显示） */
  silent?: boolean;
  /** 消息的结果 */
  result?: any;
  /** 消息开始时间戳 */
  begin?: number;
  /** 消息结束时间戳 */
  end?: number;
}

export interface Attachment {
  name?: string;
  url?: string;
  type?: string;
  content_type?: string;
  bytes?: number;
  created_at?: number;
  file_id?: string;
  chat_id?: string;
  assistant_id?: string;
}

export type ResHookInit =  null | string  | {
  assistant_id?: string;
  chat_id?: string;
  next?: NextAction;
  input?: Message[];
  options?: Payload;
  result?: any;
}

export type ResHookRrety = string | boolean | { action: Action } | null;

export interface ResHookStream {
  silent?: boolean;
  next?: NextAction;
  output?: string;
}

export interface NextAction {
  action: string;
  payload?: Payload;
}

export type ResHookDone = null |  {
  /** next action */
  next?: NextAction;
  /** hook input */
  input?: Message[];
  /** hook response */
  output?: Message[];
  result?: any;
}

export type ResHookFail = string | {
  next?: NextAction;
  output?: string;
  error?: string;
}

export interface FCAttributes {
  name: string;
  arguments: string;
}

export interface FunctionCall {
  index: number;
  id: string;
  type: string;
  function: FCAttributes;
}

export interface Mention {
  assistant_id: string;
  name: string;
  avatar?: string;
}

/**
 * Sends a message with an option to save history.
 */
export declare function Send(str: string | object, saveHistory?: boolean): void;
