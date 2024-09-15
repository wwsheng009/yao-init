import { Exception, Process } from "./__types/yao";

/**
 * api guard
 * @param {string} path api path
 * @param {map} params api path params
 * @param {map} queries api queries in url query string
 * @param {object|string} payload json object or string
 * @param {map} headers request headers
 */
export function CheckAccessKey(
  path: string,
  params: any,
  queries: { [x: string]: any[] },
  payload: any,
  headers: { [x: string]: any }
) {
  var token;
  let auth = headers["Authorization"];
  if (auth) {
    token = auth[0].replace("Bearer ", "");
  }
  token = token || (queries["token"] && queries["token"][0]);
  if (!token) {
    error();
  }
  let access_key = Process("yao.env.get", "YAO_API_ACCESS_KEY");
  if (!access_key) {
    throw new Exception("YAO_API_ACCESS_KEY Not set", 403);
  }
  if (access_key !== token) {
    error();
  }
}

function error() {
  throw new Exception("Not Authorized", 403);
}
