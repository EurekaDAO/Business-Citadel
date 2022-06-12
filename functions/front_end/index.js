var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new File(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var s, S, f, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js"() {
    init_shims();
    init_polyfills();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f = 1;
    F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index: index5, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index5 === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index5++;
                break;
              } else if (index5 - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index5 = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index5 + 2]) {
                index5 = -2;
              }
              if (c === boundary[index5 + 2]) {
                index5++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index5 = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index5++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index5 === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index5;
              if (index5 === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index5 < boundary.length) {
                if (boundary[index5] === c) {
                  if (index5 === 0) {
                    dataCallback("onPartData", true);
                  }
                  index5++;
                } else {
                  index5 = 0;
                }
              } else if (index5 === boundary.length) {
                index5++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index5 = 0;
                }
              } else if (index5 - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index5 = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index5 = 0;
                  }
                } else {
                  index5 = 0;
                }
              }
              if (index5 > 0) {
                lookbehind[index5 - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index5;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// node_modules/@sveltejs/kit/dist/node/polyfills.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base642 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base642 = true;
    } else {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base642 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* toIterator(parts, clone2) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0, b = part;
      while (position !== b.size) {
        const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
function formDataToBlob(F2, B = Blob$1) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  const { body } = data;
  if (body === null) {
    return import_node_buffer.Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return import_node_buffer.Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error2 = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error2);
        throw error2;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    const error_ = error2 instanceof FetchBaseError ? error2 : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return import_node_buffer.Buffer.from(accum.join(""));
      }
      return import_node_buffer.Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers2(headers.reduce((result, value, index5, array2) => {
    if (index5 % 2 === 0) {
      result.push(array2.slice(index5, index5 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_node_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (/^(.+\.)*localhost$/.test(url.host)) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request2(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dataUriToBuffer(request.url);
      const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_node_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL.toString(), options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error2) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error2.message}`, "system", error2));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error2) => {
      response.body.destroy(error2);
    });
    if (process.version < "v14") {
      request_.on("socket", (s3) => {
        let endedWithEventsCount;
        s3.prependListener("end", () => {
          endedWithEventsCount = s3._eventsCount;
        });
        s3.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s3._eventsCount && !hadError) {
            const error2 = new Error("Premature close");
            error2.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error2);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        let locationURL = null;
        try {
          locationURL = location === null ? null : new URL(location, request.url);
        } catch {
          if (request.redirect !== "manual") {
            reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
            finalize();
            return;
          }
        }
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers2(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (!isDomainOrSubdomain(request.url, locationURL)) {
              for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                requestOptions.headers.delete(name);
              }
            }
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve2(fetch2(new Request2(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), (error2) => {
        if (error2) {
          reject(error2);
        }
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), (error2) => {
          if (error2) {
            reject(error2);
          }
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), (error2) => {
          if (error2) {
            reject(error2);
          }
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflate(), (error2) => {
              if (error2) {
                reject(error2);
              }
            });
          } else {
            body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflateRaw(), (error2) => {
              if (error2) {
                reject(error2);
              }
            });
          }
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        raw.once("end", () => {
          if (!response) {
            response = new Response2(body, responseOptions);
            resolve2(response);
          }
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), (error2) => {
          if (error2) {
            reject(error2);
          }
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request).catch(reject);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = import_node_buffer.Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error2 = new Error("Premature close");
        error2.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error2);
      }
    };
    socket.prependListener("close", onSocketClose);
    request.on("abort", () => {
      socket.removeListener("close", onSocketClose);
    });
    socket.on("data", (buf) => {
      properLastChunkReceived = import_node_buffer.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = import_node_buffer.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && import_node_buffer.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    });
  });
}
function installPolyfills() {
  for (const name in globals) {
    Object.defineProperty(globalThis, name, {
      enumerable: true,
      configurable: true,
      value: globals[name]
    });
  }
}
var import_node_http, import_node_https, import_node_zlib, import_node_stream, import_node_buffer, import_node_util, import_node_url, import_node_net, import_crypto, commonjsGlobal, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _Blob, Blob2, Blob$1, _File, File, t, i, h, r, m, f2, e, x, FormData, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, isDomainOrSubdomain, pipeline, INTERNALS$2, Body, clone, getNonSpecFormDataBoundary, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers2, redirectStatus, isRedirect, INTERNALS$1, Response2, getSearch, ReferrerPolicy, DEFAULT_REFERRER_POLICY, INTERNALS, isRequest, doBadDataWarn, Request2, getNodeRequestOptions, AbortError, supportedSchemas, globals;
var init_polyfills = __esm({
  "node_modules/@sveltejs/kit/dist/node/polyfills.js"() {
    init_shims();
    import_node_http = __toESM(require("node:http"), 1);
    import_node_https = __toESM(require("node:https"), 1);
    import_node_zlib = __toESM(require("node:zlib"), 1);
    import_node_stream = __toESM(require("node:stream"), 1);
    import_node_buffer = require("node:buffer");
    import_node_util = require("node:util");
    import_node_url = require("node:url");
    import_node_net = require("node:net");
    import_crypto = require("crypto");
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop4() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals2 = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop4;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask2 = (() => {
          const globalQueueMicrotask = globals2 && globals2.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F2, V, args) {
          if (typeof F2 !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F2, V, args);
        }
        function promiseCall(F2, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F2, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve2, reject) => {
            reader._closedPromise_resolve = resolve2;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask2(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry5 = this._queue.shift();
              this._queueTotalSize -= entry5.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry5.buffer, entry5.byteOffset, entry5.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve2, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve2,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve2, reject) => {
            const closeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve2, reject) => {
            const writeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error2) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error2);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error2) {
          stream._inFlightWriteRequest._reject(error2);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error2) {
          stream._inFlightCloseRequest._reject(error2);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error2);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error2) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error2);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error2) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error2);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error2) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error2);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error2) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error2);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve2, reject) => {
            writer._closedPromise_resolve = resolve2;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve2, reject) => {
            writer._readyPromise_resolve = resolve2;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve2, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error2 = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error2);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop4);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error2) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error2));
              } else {
                finalize(isError, error2);
              }
            }
            function finalize(isError, error2) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error2);
              } else {
                resolve2(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgain = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function pullAlgorithm() {
            if (reading) {
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask2(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask2(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask2(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              readAgainForBranch1 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              readAgainForBranch2 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options, context) {
          assertDictionary(options, context);
          const mode = options === null || options === void 0 ? void 0 : options.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options, context) {
          assertDictionary(options, context);
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options, context) {
          assertDictionary(options, context);
          const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
          const signal = options === null || options === void 0 ? void 0 : options.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable2 = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable2, "readable", "ReadableWritablePair");
          assertReadableStream(readable2, `${context} has member 'readable' that`);
          const writable3 = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable3, "writable", "ReadableWritablePair");
          assertWritableStream(writable3, `${context} has member 'writable' that`);
          return { readable: readable2, writable: writable3 };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options = convertReaderOptions(rawOptions, "First parameter");
            if (options.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options;
            try {
              options = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e2) {
              return promiseRejectedWith(e2);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop4);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        try {
          Object.defineProperty(byteLengthSizeFunction, "name", {
            value: "size",
            configurable: true
          });
        } catch (_a) {
        }
        class ByteLengthQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        try {
          Object.defineProperty(countSizeFunction, "name", {
            value: "size",
            configurable: true
          });
        } catch (_a) {
        }
        class CountQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "CountQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve2) => {
              startPromise_resolve = resolve2;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve2) => {
            stream._backpressureChangePromise_resolve = resolve2;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error2 = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error2);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable3 = stream._writable;
              const state = writable3._state;
              if (state === "erroring") {
                throw writable3._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable2 = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable2._state === "errored") {
              throw readable2._storedError;
            }
            ReadableStreamDefaultControllerClose(readable2._readableStreamController);
          }, (r2) => {
            TransformStreamError(stream, r2);
            throw readable2._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports2.CountQueuingStrategy = CountQueuingStrategy;
        exports2.ReadableByteStreamController = ReadableByteStreamController;
        exports2.ReadableStream = ReadableStream2;
        exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports2.TransformStream = TransformStream;
        exports2.TransformStreamDefaultController = TransformStreamDefaultController;
        exports2.WritableStream = WritableStream;
        exports2.WritableStreamDefaultController = WritableStreamDefaultController;
        exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("node:process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("node:stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error2) {
          process2.emitWarning = emitWarning;
          throw error2;
        }
      } catch (error2) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error2) {
    }
    POOL_SIZE = 65536;
    _Blob = class Blob {
      #parts = [];
      #type = "";
      #size = 0;
      #endings = "transparent";
      constructor(blobParts = [], options = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder2 = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = encoder2.encode(`${element}`);
          }
          const size = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (size) {
            this.#size += size;
            this.#parts.push(part);
          }
        }
        this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
        const type = options.type === void 0 ? "" : String(options.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      get size() {
        return this.#size;
      }
      get type() {
        return this.#type;
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    Blob$1 = Blob2;
    _File = class File2 extends Blob$1 {
      #lastModified = 0;
      #name = "";
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](object) {
        return !!object && object instanceof Blob$1 && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    };
    File = _File;
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f2 = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = class FormData2 {
      #d = [];
      constructor(...a) {
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        this.#d.push(f2(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b]) => b !== a);
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = this.#d, l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return this.#d.some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f2(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        this.#d = b;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    };
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    isDomainOrSubdomain = (destination, original) => {
      const orig = new URL(original).hostname;
      const dest = new URL(destination).hostname;
      return orig === dest || orig.endsWith(`.${dest}`);
    };
    pipeline = (0, import_node_util.promisify)(import_node_stream.default.pipeline);
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = import_node_buffer.Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (import_node_buffer.Buffer.isBuffer(body))
          ;
        else if (import_node_util.types.isAnyArrayBuffer(body)) {
          body = import_node_buffer.Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = import_node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_node_stream.default)
          ;
        else if (body instanceof FormData) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = import_node_buffer.Buffer.from(String(body));
        }
        let stream = body;
        if (import_node_buffer.Buffer.isBuffer(body)) {
          stream = import_node_stream.default.Readable.from(body);
        } else if (isBlob(body)) {
          stream = import_node_stream.default.Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_node_stream.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
        return toFormData2(this.body, ct);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.arrayBuffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const text = await this.text();
        return JSON.parse(text);
      }
      async text() {
        const buffer = await consumeBody(this);
        return new TextDecoder().decode(buffer);
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true },
      data: { get: (0, import_node_util.deprecate)(() => {
      }, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_node_stream.PassThrough({ highWaterMark });
        p2 = new import_node_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    getNonSpecFormDataBoundary = (0, import_node_util.deprecate)((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (import_node_buffer.Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof import_node_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (import_node_buffer.Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      return null;
    };
    writeToStream = async (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        await pipeline(body, dest);
      }
    };
    validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error2 = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_CHAR" });
        throw error2;
      }
    };
    Headers2 = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers2) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_node_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_node_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key2) => {
          result[key2] = this.getAll(key2);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key2) => {
          const values = this.getAll(key2);
          if (key2 === "host") {
            result[key2] = values[0];
          } else {
            result[key2] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers2.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response2 = class extends Body {
      constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers2(options.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options.url,
          status,
          statusText: options.statusText || "",
          headers,
          counter: options.counter,
          highWaterMark: options.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response2(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
          highWaterMark: this.highWaterMark
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response2(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response2(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response2.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    ReferrerPolicy = /* @__PURE__ */ new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    doBadDataWarn = (0, import_node_util.deprecate)(() => {
    }, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)");
    Request2 = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
        }
        let method = init2.method || input.method || "GET";
        if (/^(delete|get|head|options|post|put)$/i.test(method)) {
          method = method.toUpperCase();
        }
        if ("data" in init2) {
          doBadDataWarn();
        }
        if ((init2.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_node_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
      }
      clone() {
        return new Request2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers2(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const options = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options
      };
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    if (!globalThis.DOMException) {
      try {
        const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
      }
    }
    supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
    globals = {
      crypto: import_crypto.webcrypto,
      fetch: fetch2,
      Response: Response2,
      Request: Request2,
      Headers: Headers2
    };
  }
});

// node_modules/svelte-adapter-firebase/src/files/shims.js
var init_shims = __esm({
  "node_modules/svelte-adapter-firebase/src/files/shims.js"() {
    init_polyfills();
    installPolyfills();
  }
});

// .svelte-kit/output/server/chunks/index-cdce086c.js
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
  return context;
}
function getContext(key2) {
  return get_current_component().$$.context.get(key2);
}
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css7) => css7.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  const assignment = boolean && value === true ? "" : `="${escape_attribute_value(value.toString())}"`;
  return ` ${name}${assignment}`;
}
function add_classes(classes) {
  return classes ? ` class="${classes}"` : "";
}
var current_component, escaped, missing_component, on_destroy;
var init_index_cdce086c = __esm({
  ".svelte-kit/output/server/chunks/index-cdce086c.js"() {
    init_shims();
    Promise.resolve();
    escaped = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    missing_component = {
      $$render: () => ""
    };
  }
});

// .svelte-kit/output/server/chunks/hooks-1c45ba0b.js
var hooks_1c45ba0b_exports = {};
var init_hooks_1c45ba0b = __esm({
  ".svelte-kit/output/server/chunks/hooks-1c45ba0b.js"() {
    init_shims();
  }
});

// .svelte-kit/output/server/entries/pages/__layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => _layout
});
var getStores, page, logo, Header, css, _layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/__layout.svelte.js"() {
    init_shims();
    init_index_cdce086c();
    getStores = () => {
      const stores = getContext("__svelte__");
      return {
        page: {
          subscribe: stores.page.subscribe
        },
        navigating: {
          subscribe: stores.navigating.subscribe
        },
        get preloading() {
          console.error("stores.preloading is deprecated; use stores.navigating instead");
          return {
            subscribe: stores.navigating.subscribe
          };
        },
        session: stores.session,
        updated: stores.updated
      };
    };
    page = {
      subscribe(fn) {
        const store = getStores().page;
        return store.subscribe(fn);
      }
    };
    logo = "/_app/immutable/assets/flow-logo-9aeb5100.svg";
    Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      $$unsubscribe_page();
      return `<nav class="${"container"}"><ul><li><img style="${"width:2em; height:2em;"}"${add_attribute("src", logo, 0)} alt="${"Learn how to build on Flow"}"></li></ul>
  <ul><li${add_classes(($page.url.pathname === "/" ? "active" : "").trim())}><a sveltekit:prefetch href="${"/"}">Home</a></li>
    <li${add_classes(($page.url.pathname === "/about" ? "active" : "").trim())}><a sveltekit:prefetch href="${"/about"}">About</a></li></ul></nav>`;
    });
    css = {
      code: "footer.svelte-1anlrnp.svelte-1anlrnp{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:40px}footer.svelte-1anlrnp a.svelte-1anlrnp{font-weight:bold}@media(min-width: 480px){footer.svelte-1anlrnp.svelte-1anlrnp{padding:40px 0}}",
      map: null
    };
    _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

<main class="${"container"}">${slots.default ? slots.default({}) : ``}</main>

<footer class="${"svelte-1anlrnp"}"><p>visit <a href="${"https://docs.onflow.org"}" class="${"svelte-1anlrnp"}">docs.onflow.org</a> to learn more.
  </p>
  <p><a href="${"https://github.com/muttoni/fcl-sveltekit"}" class="${"svelte-1anlrnp"}"><svg width="${"32"}" height="${"32"}" viewBox="${"0 0 1024 1024"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"}" transform="${"scale(64)"}" fill="${"currentColor"}"></path></svg></a></p>
</footer>`;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  css: () => css2,
  entry: () => entry,
  index: () => index,
  js: () => js,
  module: () => layout_svelte_exports
});
var index, entry, js, css2;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    init_shims();
    init_layout_svelte();
    index = 0;
    entry = "pages/__layout.svelte-23284722.js";
    js = ["pages/__layout.svelte-23284722.js", "chunks/index-433ca775.js"];
    css2 = ["assets/pages/__layout.svelte-b9f64c3d.css"];
  }
});

// .svelte-kit/output/server/entries/fallbacks/error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2,
  load: () => load
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/fallbacks/error.svelte.js"() {
    init_shims();
    init_index_cdce086c();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error: error2 } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
        $$bindings.error(error2);
      return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  css: () => css3,
  entry: () => entry2,
  index: () => index2,
  js: () => js2,
  module: () => error_svelte_exports
});
var index2, entry2, js2, css3;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    init_shims();
    init_error_svelte();
    index2 = 1;
    entry2 = "error.svelte-c4f79cbf.js";
    js2 = ["error.svelte-c4f79cbf.js", "chunks/index-433ca775.js"];
    css3 = [];
  }
});

// node_modules/queue-microtask/index.js
var require_queue_microtask = __commonJS({
  "node_modules/queue-microtask/index.js"(exports, module2) {
    init_shims();
    var promise;
    module2.exports = typeof queueMicrotask === "function" ? queueMicrotask : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err) => setTimeout(() => {
      throw err;
    }, 0));
  }
});

// node_modules/@onflow/util-actor/dist/actor.js
var require_actor = __commonJS({
  "node_modules/@onflow/util-actor/dist/actor.js"(exports) {
    init_shims();
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var queueMicrotask2 = _interopDefault(require_queue_microtask());
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++)
        arr2[i2] = arr[i2];
      return arr2;
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it)
        return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i2 = 0;
        return function() {
          if (i2 >= o.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o[i2++]
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var mailbox = function mailbox2() {
      var queue = [];
      var next;
      return {
        deliver: function deliver(msg) {
          try {
            queue.push(msg);
            if (next) {
              next(queue.shift());
              next = void 0;
            }
            return Promise.resolve();
          } catch (e2) {
            return Promise.reject(e2);
          }
        },
        receive: function receive() {
          return new Promise(function innerReceive(resolve2) {
            var msg = queue.shift();
            if (msg)
              return resolve2(msg);
            next = resolve2;
          });
        }
      };
    };
    function _catch(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    function _finallyRethrows(body, finalizer) {
      try {
        var result = body();
      } catch (e2) {
        return finalizer(true, e2);
      }
      if (result && result.then) {
        return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
      }
      return finalizer(false, result);
    }
    function _settle(pact, state, value) {
      if (!pact.s) {
        if (value instanceof _Pact) {
          if (value.s) {
            if (state & 1) {
              state = value.s;
            }
            value = value.v;
          } else {
            value.o = _settle.bind(null, pact, state);
            return;
          }
        }
        if (value && value.then) {
          value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
          return;
        }
        pact.s = state;
        pact.v = value;
        var observer = pact.o;
        if (observer) {
          observer(pact);
        }
      }
    }
    var _Pact = /* @__PURE__ */ function() {
      function _Pact2() {
      }
      _Pact2.prototype.then = function(onFulfilled, onRejected) {
        var result = new _Pact2();
        var state = this.s;
        if (state) {
          var callback = state & 1 ? onFulfilled : onRejected;
          if (callback) {
            try {
              _settle(result, 1, callback(this.v));
            } catch (e2) {
              _settle(result, 2, e2);
            }
            return result;
          } else {
            return this;
          }
        }
        this.o = function(_this) {
          try {
            var value = _this.v;
            if (_this.s & 1) {
              _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
            } else if (onRejected) {
              _settle(result, 1, onRejected(value));
            } else {
              _settle(result, 2, value);
            }
          } catch (e2) {
            _settle(result, 2, e2);
          }
        };
        return result;
      };
      return _Pact2;
    }();
    function _isSettledPact(thenable) {
      return thenable instanceof _Pact && thenable.s & 1;
    }
    function _for(test, update, body) {
      var stage;
      for (; ; ) {
        var shouldContinue = test();
        if (_isSettledPact(shouldContinue)) {
          shouldContinue = shouldContinue.v;
        }
        if (!shouldContinue) {
          return result;
        }
        if (shouldContinue.then) {
          stage = 0;
          break;
        }
        var result = body();
        if (result && result.then) {
          if (_isSettledPact(result)) {
            result = result.s;
          } else {
            stage = 1;
            break;
          }
        }
        if (update) {
          var updateValue = update();
          if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
            stage = 2;
            break;
          }
        }
      }
      var pact = new _Pact();
      var reject = _settle.bind(null, pact, 2);
      (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
      return pact;
      function _resumeAfterBody(value) {
        result = value;
        do {
          if (update) {
            updateValue = update();
            if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
              updateValue.then(_resumeAfterUpdate).then(void 0, reject);
              return;
            }
          }
          shouldContinue = test();
          if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
            _settle(pact, 1, result);
            return;
          }
          if (shouldContinue.then) {
            shouldContinue.then(_resumeAfterTest).then(void 0, reject);
            return;
          }
          result = body();
          if (_isSettledPact(result)) {
            result = result.v;
          }
        } while (!result || !result.then);
        result.then(_resumeAfterBody).then(void 0, reject);
      }
      function _resumeAfterTest(shouldContinue2) {
        if (shouldContinue2) {
          result = body();
          if (result && result.then) {
            result.then(_resumeAfterBody).then(void 0, reject);
          } else {
            _resumeAfterBody(result);
          }
        } else {
          _settle(pact, 1, result);
        }
      }
      function _resumeAfterUpdate() {
        if (shouldContinue = test()) {
          if (shouldContinue.then) {
            shouldContinue.then(_resumeAfterTest).then(void 0, reject);
          } else {
            _resumeAfterTest(shouldContinue);
          }
        } else {
          _settle(pact, 1, result);
        }
      }
    }
    var INIT = "INIT";
    var SUBSCRIBE = "SUBSCRIBE";
    var UNSUBSCRIBE = "UNSUBSCRIBE";
    var UPDATED = "UPDATED";
    var SNAPSHOT = "SNAPSHOT";
    var EXIT = "EXIT";
    var TERMINATE = "TERMINATE";
    var root = typeof self === "object" && self.self === self && self || typeof global === "object" && global.global === global && global || typeof window === "object" && window.window === window && window;
    root.FCL_REGISTRY = root.FCL_REGISTRY == null ? {} : root.FCL_REGISTRY;
    var pid = 0;
    var DEFAULT_TIMEOUT = 5e3;
    var _send = function send(addr, tag, data, opts) {
      if (opts === void 0) {
        opts = {};
      }
      return new Promise(function(reply, reject) {
        var expectReply = opts.expectReply || false;
        var timeout = opts.timeout != null ? opts.timeout : DEFAULT_TIMEOUT;
        if (expectReply && timeout) {
          setTimeout(function() {
            return reject(new Error("Timeout: " + timeout + "ms passed without a response."));
          }, timeout);
        }
        var payload = {
          to: addr,
          from: opts.from,
          tag,
          data,
          timeout,
          reply,
          reject
        };
        try {
          root.FCL_REGISTRY[addr] && root.FCL_REGISTRY[addr].mailbox.deliver(payload);
          if (!expectReply)
            reply(true);
        } catch (error2) {
          console.error("FCL.Actor -- Could Not Deliver Message", payload, root.FCL_REGISTRY[addr], error2);
        }
      });
    };
    var kill = function kill2(addr) {
      delete root.FCL_REGISTRY[addr];
    };
    var fromHandlers = function fromHandlers2(handlers) {
      if (handlers === void 0) {
        handlers = {};
      }
      return function(ctx) {
        try {
          var _temp12 = function _temp122() {
            var _loopInterrupt;
            var _temp6 = _for(function() {
              return !_loopInterrupt && 1;
            }, void 0, function() {
              return Promise.resolve(ctx.receive()).then(function(letter) {
                var _temp5 = _finallyRethrows(function() {
                  return _catch(function() {
                    function _temp4() {
                      return Promise.resolve(handlers[letter.tag](ctx, letter, letter.data || {})).then(function() {
                      });
                    }
                    var _temp3 = function() {
                      if (letter.tag === EXIT) {
                        var _temp10 = function _temp102() {
                          _loopInterrupt = 1;
                        };
                        var _temp11 = function() {
                          if (typeof handlers[TERMINATE] === "function") {
                            return Promise.resolve(handlers[TERMINATE](ctx, letter, letter.data || {})).then(function() {
                            });
                          }
                        }();
                        return _temp11 && _temp11.then ? _temp11.then(_temp10) : _temp10(_temp11);
                      }
                    }();
                    return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
                  }, function(error2) {
                    console.error(ctx.self() + " Error", letter, error2);
                  });
                }, function(_wasThrown, _result) {
                  return;
                  if (_wasThrown)
                    throw _result;
                  return _result;
                });
                if (_temp5 && _temp5.then)
                  return _temp5.then(function() {
                  });
              });
            });
            var _temp7 = function() {
              if (_temp6 && _temp6.then)
                return _temp6.then(function() {
                });
            }();
            if (_temp7 && _temp7.then)
              return _temp7.then(function() {
              });
          };
          var _temp13 = function() {
            if (typeof handlers[INIT] === "function")
              return Promise.resolve(handlers[INIT](ctx)).then(function() {
              });
          }();
          return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(_temp12) : _temp12(_temp13));
        } catch (e2) {
          return Promise.reject(e2);
        }
      };
    };
    var spawn = function spawn2(fn, addr) {
      if (addr === void 0) {
        addr = null;
      }
      if (addr == null)
        addr = ++pid;
      if (root.FCL_REGISTRY[addr] != null)
        return addr;
      root.FCL_REGISTRY[addr] = {
        addr,
        mailbox: mailbox(),
        subs: /* @__PURE__ */ new Set(),
        kvs: {}
      };
      var ctx = {
        self: function self2() {
          return addr;
        },
        receive: function receive() {
          return root.FCL_REGISTRY[addr].mailbox.receive();
        },
        send: function send(to, tag, data, opts) {
          if (opts === void 0) {
            opts = {};
          }
          opts.from = addr;
          return _send(to, tag, data, opts);
        },
        sendSelf: function sendSelf(tag, data, opts) {
          if (root.FCL_REGISTRY[addr])
            _send(addr, tag, data, opts);
        },
        broadcast: function broadcast(tag, data, opts) {
          if (opts === void 0) {
            opts = {};
          }
          opts.from = addr;
          for (var _iterator = _createForOfIteratorHelperLoose(root.FCL_REGISTRY[addr].subs), _step; !(_step = _iterator()).done; ) {
            var to = _step.value;
            _send(to, tag, data, opts);
          }
        },
        subscribe: function subscribe2(sub) {
          return sub != null && root.FCL_REGISTRY[addr].subs.add(sub);
        },
        unsubscribe: function unsubscribe(sub) {
          return sub != null && root.FCL_REGISTRY[addr].subs["delete"](sub);
        },
        subscriberCount: function subscriberCount() {
          return root.FCL_REGISTRY[addr].subs.size;
        },
        hasSubs: function hasSubs() {
          return !!root.FCL_REGISTRY[addr].subs.size;
        },
        put: function put(key2, value) {
          if (key2 != null)
            root.FCL_REGISTRY[addr].kvs[key2] = value;
        },
        get: function get(key2, fallback) {
          var value = root.FCL_REGISTRY[addr].kvs[key2];
          return value == null ? fallback : value;
        },
        "delete": function _delete(key2) {
          delete root.FCL_REGISTRY[addr].kvs[key2];
        },
        update: function update(key2, fn2) {
          if (key2 != null)
            root.FCL_REGISTRY[addr].kvs[key2] = fn2(root.FCL_REGISTRY[addr].kvs[key2]);
        },
        keys: function keys() {
          return Object.keys(root.FCL_REGISTRY[addr].kvs);
        },
        all: function all() {
          return root.FCL_REGISTRY[addr].kvs;
        },
        where: function where(pattern) {
          return Object.keys(root.FCL_REGISTRY[addr].kvs).reduce(function(acc, key2) {
            var _extends2;
            return pattern.test(key2) ? _extends({}, acc, (_extends2 = {}, _extends2[key2] = root.FCL_REGISTRY[addr].kvs[key2], _extends2)) : acc;
          }, {});
        },
        merge: function merge(data) {
          if (data === void 0) {
            data = {};
          }
          Object.keys(data).forEach(function(key2) {
            return root.FCL_REGISTRY[addr].kvs[key2] = data[key2];
          });
        }
      };
      if (typeof fn === "object")
        fn = fromHandlers(fn);
      queueMicrotask2(function() {
        try {
          return Promise.resolve(fn(ctx)).then(function() {
            kill(addr);
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
      return addr;
    };
    function subscriber(address, spawnFn, callback) {
      spawnFn(address);
      var EXIT2 = "@EXIT";
      var self2 = spawn(function(ctx) {
        try {
          var _exit2;
          ctx.send(address, SUBSCRIBE);
          return Promise.resolve(_for(function() {
            return !_exit2 && 1;
          }, void 0, function() {
            return Promise.resolve(ctx.receive()).then(function(letter) {
              if (letter.tag === EXIT2) {
                ctx.send(address, UNSUBSCRIBE);
                _exit2 = 1;
                return;
              }
              callback(letter.data);
            });
          }));
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
      return function() {
        return _send(self2, EXIT2);
      };
    }
    function snapshoter(address, spawnFn) {
      spawnFn(address);
      return _send(address, SNAPSHOT, null, {
        expectReply: true,
        timeout: 0
      });
    }
    exports.EXIT = EXIT;
    exports.INIT = INIT;
    exports.SNAPSHOT = SNAPSHOT;
    exports.SUBSCRIBE = SUBSCRIBE;
    exports.TERMINATE = TERMINATE;
    exports.UNSUBSCRIBE = UNSUBSCRIBE;
    exports.UPDATED = UPDATED;
    exports.kill = kill;
    exports.send = _send;
    exports.snapshoter = snapshoter;
    exports.spawn = spawn;
    exports.subscriber = subscriber;
  }
});

// node_modules/@onflow/config/dist/config.js
var require_config = __commonJS({
  "node_modules/@onflow/config/dist/config.js"(exports) {
    init_shims();
    var utilActor = require_actor();
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var _iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
    var _asyncIteratorSymbol = typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")) : "@@asyncIterator";
    function _catch(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var _HANDLERS;
    var first = function first2(wants, fallback) {
      if (wants === void 0) {
        wants = [];
      }
      try {
        if (!wants.length)
          return Promise.resolve(fallback);
        var _wants = wants, head = _wants[0], rest = _wants.slice(1);
        return Promise.resolve(get(head)).then(function(ret) {
          return ret == null ? first2(rest, fallback) : ret;
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var NAME2 = "config";
    var PUT = "PUT_CONFIG";
    var GET = "GET_CONFIG";
    var GET_ALL = "GET_ALL_CONFIG";
    var UPDATE = "UPDATE_CONFIG";
    var DELETE = "DELETE_CONFIG";
    var CLEAR = "CLEAR_CONFIG";
    var WHERE = "WHERE_CONFIG";
    var UPDATED = "CONFIG/UPDATED";
    var identity = function identity2(v) {
      return v;
    };
    var HANDLERS = (_HANDLERS = {}, _HANDLERS[PUT] = function(ctx, _letter, _ref) {
      var key2 = _ref.key, value = _ref.value;
      if (key2 == null)
        throw new Error("Missing 'key' for config/put.");
      ctx.put(key2, value);
      ctx.broadcast(UPDATED, _extends({}, ctx.all()));
    }, _HANDLERS[GET] = function(ctx, letter, _ref2) {
      var key2 = _ref2.key, fallback = _ref2.fallback;
      if (key2 == null)
        throw new Error("Missing 'key' for config/get");
      letter.reply(ctx.get(key2, fallback));
    }, _HANDLERS[GET_ALL] = function(ctx, letter) {
      letter.reply(_extends({}, ctx.all()));
    }, _HANDLERS[UPDATE] = function(ctx, letter, _ref3) {
      var key2 = _ref3.key, fn = _ref3.fn;
      if (key2 == null)
        throw new Error("Missing 'key' for config/update");
      ctx.update(key2, fn || identity);
      ctx.broadcast(UPDATED, _extends({}, ctx.all()));
    }, _HANDLERS[DELETE] = function(ctx, letter, _ref4) {
      var key2 = _ref4.key;
      if (key2 == null)
        throw new Error("Missing 'key' for config/delete");
      ctx["delete"](key2);
      ctx.broadcast(UPDATED, _extends({}, ctx.all()));
    }, _HANDLERS[CLEAR] = function(ctx, letter) {
      var keys = Object.keys(ctx.all());
      for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
        var key2 = _keys[_i];
        ctx["delete"](key2);
      }
      ctx.broadcast(UPDATED, _extends({}, ctx.all()));
    }, _HANDLERS[WHERE] = function(ctx, letter, _ref5) {
      var pattern = _ref5.pattern;
      if (pattern == null)
        throw new Error("Missing 'pattern' for config/where");
      letter.reply(ctx.where(pattern));
    }, _HANDLERS[utilActor.SUBSCRIBE] = function(ctx, letter) {
      ctx.subscribe(letter.from);
      ctx.send(letter.from, UPDATED, _extends({}, ctx.all()));
    }, _HANDLERS[utilActor.UNSUBSCRIBE] = function(ctx, letter) {
      ctx.unsubscribe(letter.from);
    }, _HANDLERS);
    utilActor.spawn(HANDLERS, NAME2);
    function put(key2, value) {
      utilActor.send(NAME2, PUT, {
        key: key2,
        value
      });
      return config2();
    }
    function get(key2, fallback) {
      return utilActor.send(NAME2, GET, {
        key: key2,
        fallback
      }, {
        expectReply: true,
        timeout: 10
      });
    }
    function all() {
      return utilActor.send(NAME2, GET_ALL, null, {
        expectReply: true,
        timeout: 10
      });
    }
    function update(key2, fn) {
      if (fn === void 0) {
        fn = identity;
      }
      utilActor.send(NAME2, UPDATE, {
        key: key2,
        fn
      });
      return config2();
    }
    function _delete(key2) {
      utilActor.send(NAME2, DELETE, {
        key: key2
      });
      return config2();
    }
    function where(pattern) {
      return utilActor.send(NAME2, WHERE, {
        pattern
      }, {
        expectReply: true,
        timeout: 10
      });
    }
    function subscribe2(callback) {
      return utilActor.subscriber(NAME2, function() {
        return utilActor.spawn(HANDLERS, NAME2);
      }, callback);
    }
    function clearConfig() {
      return utilActor.send(NAME2, CLEAR);
    }
    function config2(values) {
      if (values != null && typeof values === "object") {
        Object.keys(values).map(function(d) {
          return put(d, values[d]);
        });
      }
      return {
        put,
        get,
        all,
        first,
        update,
        "delete": _delete,
        where,
        subscribe: subscribe2,
        overload
      };
    }
    config2.put = put;
    config2.get = get;
    config2.all = all;
    config2.first = first;
    config2.update = update;
    config2["delete"] = _delete;
    config2.where = where;
    config2.subscribe = subscribe2;
    config2.overload = overload;
    var noop4 = function noop5(v) {
      return v;
    };
    function overload(opts, callback) {
      if (opts === void 0) {
        opts = {};
      }
      if (callback === void 0) {
        callback = noop4;
      }
      return new Promise(function(resolve2, reject) {
        try {
          return Promise.resolve(all()).then(function(oldConfig) {
            var _temp = _catch(function() {
              config2(opts);
              var _callback = callback;
              return Promise.resolve(all()).then(function(_all) {
                return Promise.resolve(_callback(_all)).then(function(result) {
                  return Promise.resolve(clearConfig()).then(function() {
                    return Promise.resolve(config2(oldConfig)).then(function() {
                      resolve2(result);
                    });
                  });
                });
              });
            }, function(error2) {
              return Promise.resolve(clearConfig()).then(function() {
                return Promise.resolve(config2(oldConfig)).then(function() {
                  reject(error2);
                });
              });
            });
            if (_temp && _temp.then)
              return _temp.then(function() {
              });
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }
    exports.clearConfig = clearConfig;
    exports.config = config2;
  }
});

// node_modules/@onflow/util-invariant/dist/util-invariant.js
var require_util_invariant = __commonJS({
  "node_modules/@onflow/util-invariant/dist/util-invariant.js"(exports) {
    init_shims();
    function invariant(fact, msg) {
      if (!fact) {
        var _console;
        var error2 = new Error("INVARIANT " + msg);
        error2.stack = error2.stack.split("\n").filter(function(d) {
          return !/at invariant/.test(d);
        }).join("\n");
        (_console = console).error.apply(_console, ["\n\n---\n\n", error2, "\n\n"].concat([].slice.call(arguments, 2), ["\n\n---\n\n"]));
        throw error2;
      }
    }
    exports.invariant = invariant;
  }
});

// node_modules/@onflow/util-logger/dist/util-logger.js
var require_util_logger = __commonJS({
  "node_modules/@onflow/util-logger/dist/util-logger.js"(exports) {
    init_shims();
    var promise;
    var queueMicrotask_1 = typeof queueMicrotask === "function" ? queueMicrotask : function(cb) {
      return (promise || (promise = Promise.resolve())).then(cb)["catch"](function(err) {
        return setTimeout(function() {
          throw err;
        }, 0);
      });
    };
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
        arr2[i2] = arr[i2];
      }
      return arr2;
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it)
        return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i2 = 0;
        return function() {
          if (i2 >= o.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o[i2++]
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var mailbox = function mailbox2() {
      var queue = [];
      var next;
      return {
        deliver: function deliver(msg) {
          try {
            queue.push(msg);
            if (next) {
              next(queue.shift());
              next = void 0;
            }
            return Promise.resolve();
          } catch (e2) {
            return Promise.reject(e2);
          }
        },
        receive: function receive() {
          return new Promise(function innerReceive(resolve2) {
            var msg = queue.shift();
            if (msg)
              return resolve2(msg);
            next = resolve2;
          });
        }
      };
    };
    function _catch(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    function _finallyRethrows(body, finalizer) {
      try {
        var result = body();
      } catch (e2) {
        return finalizer(true, e2);
      }
      if (result && result.then) {
        return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
      }
      return finalizer(false, result);
    }
    function _settle(pact, state, value) {
      if (!pact.s) {
        if (value instanceof _Pact) {
          if (value.s) {
            if (state & 1) {
              state = value.s;
            }
            value = value.v;
          } else {
            value.o = _settle.bind(null, pact, state);
            return;
          }
        }
        if (value && value.then) {
          value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
          return;
        }
        pact.s = state;
        pact.v = value;
        var observer = pact.o;
        if (observer) {
          observer(pact);
        }
      }
    }
    var _Pact = /* @__PURE__ */ function() {
      function _Pact2() {
      }
      _Pact2.prototype.then = function(onFulfilled, onRejected) {
        var result = new _Pact2();
        var state = this.s;
        if (state) {
          var callback = state & 1 ? onFulfilled : onRejected;
          if (callback) {
            try {
              _settle(result, 1, callback(this.v));
            } catch (e2) {
              _settle(result, 2, e2);
            }
            return result;
          } else {
            return this;
          }
        }
        this.o = function(_this) {
          try {
            var value = _this.v;
            if (_this.s & 1) {
              _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
            } else if (onRejected) {
              _settle(result, 1, onRejected(value));
            } else {
              _settle(result, 2, value);
            }
          } catch (e2) {
            _settle(result, 2, e2);
          }
        };
        return result;
      };
      return _Pact2;
    }();
    function _isSettledPact(thenable) {
      return thenable instanceof _Pact && thenable.s & 1;
    }
    function _for(test, update2, body) {
      var stage;
      for (; ; ) {
        var shouldContinue = test();
        if (_isSettledPact(shouldContinue)) {
          shouldContinue = shouldContinue.v;
        }
        if (!shouldContinue) {
          return result;
        }
        if (shouldContinue.then) {
          stage = 0;
          break;
        }
        var result = body();
        if (result && result.then) {
          if (_isSettledPact(result)) {
            result = result.s;
          } else {
            stage = 1;
            break;
          }
        }
        if (update2) {
          var updateValue = update2();
          if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
            stage = 2;
            break;
          }
        }
      }
      var pact = new _Pact();
      var reject = _settle.bind(null, pact, 2);
      (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
      return pact;
      function _resumeAfterBody(value) {
        result = value;
        do {
          if (update2) {
            updateValue = update2();
            if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
              updateValue.then(_resumeAfterUpdate).then(void 0, reject);
              return;
            }
          }
          shouldContinue = test();
          if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
            _settle(pact, 1, result);
            return;
          }
          if (shouldContinue.then) {
            shouldContinue.then(_resumeAfterTest).then(void 0, reject);
            return;
          }
          result = body();
          if (_isSettledPact(result)) {
            result = result.v;
          }
        } while (!result || !result.then);
        result.then(_resumeAfterBody).then(void 0, reject);
      }
      function _resumeAfterTest(shouldContinue2) {
        if (shouldContinue2) {
          result = body();
          if (result && result.then) {
            result.then(_resumeAfterBody).then(void 0, reject);
          } else {
            _resumeAfterBody(result);
          }
        } else {
          _settle(pact, 1, result);
        }
      }
      function _resumeAfterUpdate() {
        if (shouldContinue = test()) {
          if (shouldContinue.then) {
            shouldContinue.then(_resumeAfterTest).then(void 0, reject);
          } else {
            _resumeAfterTest(shouldContinue);
          }
        } else {
          _settle(pact, 1, result);
        }
      }
    }
    var INIT = "INIT";
    var SUBSCRIBE = "SUBSCRIBE";
    var UNSUBSCRIBE = "UNSUBSCRIBE";
    var EXIT = "EXIT";
    var TERMINATE = "TERMINATE";
    var root = typeof self === "object" && self.self === self && self || typeof global === "object" && global.global === global && global || typeof window === "object" && window.window === window && window;
    root.FCL_REGISTRY = root.FCL_REGISTRY == null ? {} : root.FCL_REGISTRY;
    var pid = 0;
    var DEFAULT_TIMEOUT = 5e3;
    var _send = function send(addr, tag, data, opts) {
      if (opts === void 0) {
        opts = {};
      }
      return new Promise(function(reply, reject) {
        var expectReply = opts.expectReply || false;
        var timeout = opts.timeout != null ? opts.timeout : DEFAULT_TIMEOUT;
        if (expectReply && timeout) {
          setTimeout(function() {
            return reject(new Error("Timeout: " + timeout + "ms passed without a response."));
          }, timeout);
        }
        var payload = {
          to: addr,
          from: opts.from,
          tag,
          data,
          timeout,
          reply,
          reject
        };
        try {
          root.FCL_REGISTRY[addr] && root.FCL_REGISTRY[addr].mailbox.deliver(payload);
          if (!expectReply)
            reply(true);
        } catch (error2) {
          console.error("FCL.Actor -- Could Not Deliver Message", payload, root.FCL_REGISTRY[addr], error2);
        }
      });
    };
    var kill = function kill2(addr) {
      delete root.FCL_REGISTRY[addr];
    };
    var fromHandlers = function fromHandlers2(handlers) {
      if (handlers === void 0) {
        handlers = {};
      }
      return function(ctx) {
        try {
          var _temp12 = function _temp122() {
            var _loopInterrupt;
            var _temp6 = _for(function() {
              return !_loopInterrupt && 1;
            }, void 0, function() {
              return Promise.resolve(ctx.receive()).then(function(letter) {
                var _temp5 = _finallyRethrows(function() {
                  return _catch(function() {
                    function _temp4() {
                      return Promise.resolve(handlers[letter.tag](ctx, letter, letter.data || {})).then(function() {
                      });
                    }
                    var _temp3 = function() {
                      if (letter.tag === EXIT) {
                        var _temp10 = function _temp102() {
                          _loopInterrupt = 1;
                        };
                        var _temp11 = function() {
                          if (typeof handlers[TERMINATE] === "function") {
                            return Promise.resolve(handlers[TERMINATE](ctx, letter, letter.data || {})).then(function() {
                            });
                          }
                        }();
                        return _temp11 && _temp11.then ? _temp11.then(_temp10) : _temp10(_temp11);
                      }
                    }();
                    return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
                  }, function(error2) {
                    console.error(ctx.self() + " Error", letter, error2);
                  });
                }, function(_wasThrown, _result) {
                  return;
                  if (_wasThrown)
                    throw _result;
                  return _result;
                });
                if (_temp5 && _temp5.then)
                  return _temp5.then(function() {
                  });
              });
            });
            var _temp7 = function() {
              if (_temp6 && _temp6.then)
                return _temp6.then(function() {
                });
            }();
            if (_temp7 && _temp7.then)
              return _temp7.then(function() {
              });
          };
          var _temp13 = function() {
            if (typeof handlers[INIT] === "function")
              return Promise.resolve(handlers[INIT](ctx)).then(function() {
              });
          }();
          return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(_temp12) : _temp12(_temp13));
        } catch (e2) {
          return Promise.reject(e2);
        }
      };
    };
    var spawn = function spawn2(fn, addr) {
      if (addr === void 0) {
        addr = null;
      }
      if (addr == null)
        addr = ++pid;
      if (root.FCL_REGISTRY[addr] != null)
        return addr;
      root.FCL_REGISTRY[addr] = {
        addr,
        mailbox: mailbox(),
        subs: /* @__PURE__ */ new Set(),
        kvs: {}
      };
      var ctx = {
        self: function self2() {
          return addr;
        },
        receive: function receive() {
          return root.FCL_REGISTRY[addr].mailbox.receive();
        },
        send: function send(to, tag, data, opts) {
          if (opts === void 0) {
            opts = {};
          }
          opts.from = addr;
          return _send(to, tag, data, opts);
        },
        sendSelf: function sendSelf(tag, data, opts) {
          if (root.FCL_REGISTRY[addr])
            _send(addr, tag, data, opts);
        },
        broadcast: function broadcast(tag, data, opts) {
          if (opts === void 0) {
            opts = {};
          }
          opts.from = addr;
          for (var _iterator = _createForOfIteratorHelperLoose(root.FCL_REGISTRY[addr].subs), _step; !(_step = _iterator()).done; ) {
            var to = _step.value;
            _send(to, tag, data, opts);
          }
        },
        subscribe: function subscribe3(sub) {
          return sub != null && root.FCL_REGISTRY[addr].subs.add(sub);
        },
        unsubscribe: function unsubscribe(sub) {
          return sub != null && root.FCL_REGISTRY[addr].subs["delete"](sub);
        },
        subscriberCount: function subscriberCount() {
          return root.FCL_REGISTRY[addr].subs.size;
        },
        hasSubs: function hasSubs() {
          return !!root.FCL_REGISTRY[addr].subs.size;
        },
        put: function put2(key2, value) {
          if (key2 != null)
            root.FCL_REGISTRY[addr].kvs[key2] = value;
        },
        get: function get2(key2, fallback) {
          var value = root.FCL_REGISTRY[addr].kvs[key2];
          return value == null ? fallback : value;
        },
        "delete": function _delete2(key2) {
          delete root.FCL_REGISTRY[addr].kvs[key2];
        },
        update: function update2(key2, fn2) {
          if (key2 != null)
            root.FCL_REGISTRY[addr].kvs[key2] = fn2(root.FCL_REGISTRY[addr].kvs[key2]);
        },
        keys: function keys() {
          return Object.keys(root.FCL_REGISTRY[addr].kvs);
        },
        all: function all2() {
          return root.FCL_REGISTRY[addr].kvs;
        },
        where: function where2(pattern) {
          return Object.keys(root.FCL_REGISTRY[addr].kvs).reduce(function(acc, key2) {
            var _extends2;
            return pattern.test(key2) ? _extends({}, acc, (_extends2 = {}, _extends2[key2] = root.FCL_REGISTRY[addr].kvs[key2], _extends2)) : acc;
          }, {});
        },
        merge: function merge(data) {
          if (data === void 0) {
            data = {};
          }
          Object.keys(data).forEach(function(key2) {
            return root.FCL_REGISTRY[addr].kvs[key2] = data[key2];
          });
        }
      };
      if (typeof fn === "object")
        fn = fromHandlers(fn);
      queueMicrotask_1(function() {
        try {
          return Promise.resolve(fn(ctx)).then(function() {
            kill(addr);
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
      return addr;
    };
    function subscriber(address, spawnFn, callback) {
      spawnFn(address);
      var EXIT2 = "@EXIT";
      var self2 = spawn(function(ctx) {
        try {
          var _exit2;
          ctx.send(address, SUBSCRIBE);
          return Promise.resolve(_for(function() {
            return !_exit2 && 1;
          }, void 0, function() {
            return Promise.resolve(ctx.receive()).then(function(letter) {
              if (letter.tag === EXIT2) {
                ctx.send(address, UNSUBSCRIBE);
                _exit2 = 1;
                return;
              }
              callback(letter.data);
            });
          }));
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
      return function() {
        return _send(self2, EXIT2);
      };
    }
    function _extends$1() {
      _extends$1 = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      return _extends$1.apply(this, arguments);
    }
    var _iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
    var _asyncIteratorSymbol = typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")) : "@@asyncIterator";
    function _catch$1(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var _HANDLERS;
    var first = function first2(wants, fallback) {
      if (wants === void 0) {
        wants = [];
      }
      try {
        if (!wants.length)
          return Promise.resolve(fallback);
        var _wants = wants, head = _wants[0], rest = _wants.slice(1);
        return Promise.resolve(get(head)).then(function(ret) {
          return ret == null ? first2(rest, fallback) : ret;
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var NAME2 = "config";
    var PUT = "PUT_CONFIG";
    var GET = "GET_CONFIG";
    var GET_ALL = "GET_ALL_CONFIG";
    var UPDATE = "UPDATE_CONFIG";
    var DELETE = "DELETE_CONFIG";
    var CLEAR = "CLEAR_CONFIG";
    var WHERE = "WHERE_CONFIG";
    var UPDATED = "CONFIG/UPDATED";
    var identity = function identity2(v) {
      return v;
    };
    var HANDLERS = (_HANDLERS = {}, _HANDLERS[PUT] = function(ctx, _letter, _ref) {
      var key2 = _ref.key, value = _ref.value;
      if (key2 == null)
        throw new Error("Missing 'key' for config/put.");
      ctx.put(key2, value);
      ctx.broadcast(UPDATED, _extends$1({}, ctx.all()));
    }, _HANDLERS[GET] = function(ctx, letter, _ref2) {
      var key2 = _ref2.key, fallback = _ref2.fallback;
      if (key2 == null)
        throw new Error("Missing 'key' for config/get");
      letter.reply(ctx.get(key2, fallback));
    }, _HANDLERS[GET_ALL] = function(ctx, letter) {
      letter.reply(_extends$1({}, ctx.all()));
    }, _HANDLERS[UPDATE] = function(ctx, letter, _ref3) {
      var key2 = _ref3.key, fn = _ref3.fn;
      if (key2 == null)
        throw new Error("Missing 'key' for config/update");
      ctx.update(key2, fn || identity);
      ctx.broadcast(UPDATED, _extends$1({}, ctx.all()));
    }, _HANDLERS[DELETE] = function(ctx, letter, _ref4) {
      var key2 = _ref4.key;
      if (key2 == null)
        throw new Error("Missing 'key' for config/delete");
      ctx["delete"](key2);
      ctx.broadcast(UPDATED, _extends$1({}, ctx.all()));
    }, _HANDLERS[CLEAR] = function(ctx, letter) {
      var keys = Object.keys(ctx.all());
      for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
        var key2 = _keys[_i];
        ctx["delete"](key2);
      }
      ctx.broadcast(UPDATED, _extends$1({}, ctx.all()));
    }, _HANDLERS[WHERE] = function(ctx, letter, _ref5) {
      var pattern = _ref5.pattern;
      if (pattern == null)
        throw new Error("Missing 'pattern' for config/where");
      letter.reply(ctx.where(pattern));
    }, _HANDLERS[SUBSCRIBE] = function(ctx, letter) {
      ctx.subscribe(letter.from);
      ctx.send(letter.from, UPDATED, _extends$1({}, ctx.all()));
    }, _HANDLERS[UNSUBSCRIBE] = function(ctx, letter) {
      ctx.unsubscribe(letter.from);
    }, _HANDLERS);
    spawn(HANDLERS, NAME2);
    function put(key2, value) {
      _send(NAME2, PUT, {
        key: key2,
        value
      });
      return config2();
    }
    function get(key2, fallback) {
      return _send(NAME2, GET, {
        key: key2,
        fallback
      }, {
        expectReply: true,
        timeout: 10
      });
    }
    function all() {
      return _send(NAME2, GET_ALL, null, {
        expectReply: true,
        timeout: 10
      });
    }
    function update(key2, fn) {
      if (fn === void 0) {
        fn = identity;
      }
      _send(NAME2, UPDATE, {
        key: key2,
        fn
      });
      return config2();
    }
    function _delete(key2) {
      _send(NAME2, DELETE, {
        key: key2
      });
      return config2();
    }
    function where(pattern) {
      return _send(NAME2, WHERE, {
        pattern
      }, {
        expectReply: true,
        timeout: 10
      });
    }
    function subscribe2(callback) {
      return subscriber(NAME2, function() {
        return spawn(HANDLERS, NAME2);
      }, callback);
    }
    function clearConfig() {
      return _send(NAME2, CLEAR);
    }
    function config2(values) {
      if (values != null && typeof values === "object") {
        Object.keys(values).map(function(d) {
          return put(d, values[d]);
        });
      }
      return {
        put,
        get,
        all,
        first,
        update,
        "delete": _delete,
        where,
        subscribe: subscribe2,
        overload
      };
    }
    config2.put = put;
    config2.get = get;
    config2.all = all;
    config2.first = first;
    config2.update = update;
    config2["delete"] = _delete;
    config2.where = where;
    config2.subscribe = subscribe2;
    config2.overload = overload;
    var noop4 = function noop5(v) {
      return v;
    };
    function overload(opts, callback) {
      if (opts === void 0) {
        opts = {};
      }
      if (callback === void 0) {
        callback = noop4;
      }
      return new Promise(function(resolve2, reject) {
        try {
          return Promise.resolve(all()).then(function(oldConfig) {
            var _temp = _catch$1(function() {
              config2(opts);
              var _callback = callback;
              return Promise.resolve(all()).then(function(_all) {
                return Promise.resolve(_callback(_all)).then(function(result) {
                  return Promise.resolve(clearConfig()).then(function() {
                    return Promise.resolve(config2(oldConfig)).then(function() {
                      resolve2(result);
                    });
                  });
                });
              });
            }, function(error2) {
              return Promise.resolve(clearConfig()).then(function() {
                return Promise.resolve(config2(oldConfig)).then(function() {
                  reject(error2);
                });
              });
            });
            if (_temp && _temp.then)
              return _temp.then(function() {
              });
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }
    var LEVELS = Object.freeze({
      "debug": 5,
      "info": 4,
      "log": 3,
      "warn": 2,
      "error": 1
    });
    var buildLoggerMessageArgs = function buildLoggerMessageArgs2(_ref) {
      var title = _ref.title, message = _ref.message;
      return ["\n    %c" + title + "\n    ============================\n    " + message + "\n    ============================\n    ", "font-weight:bold;font-family:monospace;"];
    };
    var log = function log2(_ref2) {
      var title = _ref2.title, message = _ref2.message, level = _ref2.level, _ref2$always = _ref2.always, always = _ref2$always === void 0 ? false : _ref2$always;
      try {
        return Promise.resolve(config2.get("logger.level", 0)).then(function(configLoggerLevel) {
          var _console, _console2, _console3, _console4, _console5;
          if (!always && configLoggerLevel < level)
            return;
          var loggerMessageArgs = buildLoggerMessageArgs({
            title,
            message
          });
          switch (level) {
            case LEVELS.debug:
              (_console = console).debug.apply(_console, loggerMessageArgs);
              break;
            case LEVELS.info:
              (_console2 = console).info.apply(_console2, loggerMessageArgs);
              break;
            case LEVELS.warn:
              (_console3 = console).warn.apply(_console3, loggerMessageArgs);
              break;
            case LEVELS.error:
              (_console4 = console).error.apply(_console4, loggerMessageArgs);
              break;
            default:
              (_console5 = console).log.apply(_console5, loggerMessageArgs);
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    exports.LEVELS = LEVELS;
    exports.log = log;
  }
});

// node_modules/@onflow/rlp/dist/rlp.js
var require_rlp = __commonJS({
  "node_modules/@onflow/rlp/dist/rlp.js"(exports) {
    init_shims();
    var buffer = require("buffer");
    function encode2(input) {
      if (Array.isArray(input)) {
        var output = [];
        for (var i2 = 0; i2 < input.length; i2++) {
          output.push(encode2(input[i2]));
        }
        var buf = buffer.Buffer.concat(output);
        return buffer.Buffer.concat([encodeLength(buf.length, 192), buf]);
      } else {
        var inputBuf = toBuffer(input);
        return inputBuf.length === 1 && inputBuf[0] < 128 ? inputBuf : buffer.Buffer.concat([encodeLength(inputBuf.length, 128), inputBuf]);
      }
    }
    function safeParseInt(v, base2) {
      if (v.slice(0, 2) === "00") {
        throw new Error("invalid RLP: extra zeros");
      }
      return parseInt(v, base2);
    }
    function encodeLength(len, offset) {
      if (len < 56) {
        return buffer.Buffer.from([len + offset]);
      } else {
        var hexLength = intToHex(len);
        var lLength = hexLength.length / 2;
        var firstByte = intToHex(offset + 55 + lLength);
        return buffer.Buffer.from(firstByte + hexLength, "hex");
      }
    }
    function getLength(input) {
      if (!input || input.length === 0) {
        return buffer.Buffer.from([]);
      }
      var inputBuffer = toBuffer(input);
      var firstByte = inputBuffer[0];
      if (firstByte <= 127) {
        return inputBuffer.length;
      } else if (firstByte <= 183) {
        return firstByte - 127;
      } else if (firstByte <= 191) {
        return firstByte - 182;
      } else if (firstByte <= 247) {
        return firstByte - 191;
      } else {
        var llength = firstByte - 246;
        var length = safeParseInt(inputBuffer.slice(1, llength).toString("hex"), 16);
        return llength + length;
      }
    }
    function isHexPrefixed(str) {
      return str.slice(0, 2) === "0x";
    }
    function stripHexPrefix(str) {
      if (typeof str !== "string") {
        return str;
      }
      return isHexPrefixed(str) ? str.slice(2) : str;
    }
    function intToHex(integer) {
      if (integer < 0) {
        throw new Error("Invalid integer as argument, must be unsigned!");
      }
      var hex = integer.toString(16);
      return hex.length % 2 ? "0" + hex : hex;
    }
    function padToEven(a) {
      return a.length % 2 ? "0" + a : a;
    }
    function intToBuffer(integer) {
      var hex = intToHex(integer);
      return buffer.Buffer.from(hex, "hex");
    }
    function toBuffer(v) {
      if (!buffer.Buffer.isBuffer(v)) {
        if (typeof v === "string") {
          if (isHexPrefixed(v)) {
            return buffer.Buffer.from(padToEven(stripHexPrefix(v)), "hex");
          } else {
            return buffer.Buffer.from(v);
          }
        } else if (typeof v === "number") {
          if (!v) {
            return buffer.Buffer.from([]);
          } else {
            return intToBuffer(v);
          }
        } else if (v === null || v === void 0) {
          return buffer.Buffer.from([]);
        } else if (v instanceof Uint8Array) {
          return buffer.Buffer.from(v);
        } else {
          throw new Error("invalid type");
        }
      }
      return v;
    }
    Object.defineProperty(exports, "Buffer", {
      enumerable: true,
      get: function() {
        return buffer.Buffer;
      }
    });
    exports.encode = encode2;
    exports.getLength = getLength;
    exports.toBuffer = toBuffer;
  }
});

// node_modules/@onflow/util-node-http-modules/dist/util-node-http-modules.js
var require_util_node_http_modules = __commonJS({
  "node_modules/@onflow/util-node-http-modules/dist/util-node-http-modules.js"(exports) {
    init_shims();
    function _interopNamespace(e2) {
      if (e2 && e2.__esModule)
        return e2;
      var n = /* @__PURE__ */ Object.create(null);
      if (e2) {
        Object.keys(e2).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e2, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e2[k];
              }
            });
          }
        });
      }
      n["default"] = e2;
      return n;
    }
    function _catch(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var getNodeHttpModules = function getNodeHttpModules2() {
      try {
        var _temp5 = function _temp52() {
          function _temp2() {
            return {
              nodeHttpsTransport,
              nodeHttpTransport
            };
          }
          var nodeHttpTransport;
          var _temp = _catch(function() {
            return Promise.resolve(Promise.resolve().then(function() {
              return /* @__PURE__ */ _interopNamespace(require("http"));
            })["catch"](function(e2) {
              return null;
            })).then(function(_import$catch2) {
              nodeHttpTransport = _import$catch2;
            });
          }, function() {
          });
          return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
        };
        var nodeHttpsTransport;
        var _temp6 = _catch(function() {
          return Promise.resolve(Promise.resolve().then(function() {
            return /* @__PURE__ */ _interopNamespace(require("https"));
          })["catch"](function(e2) {
            return null;
          })).then(function(_import$catch) {
            nodeHttpsTransport = _import$catch;
          });
        }, function() {
        });
        return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    exports.getNodeHttpModules = getNodeHttpModules;
  }
});

// node_modules/@onflow/util-address/dist/util-address.js
var require_util_address = __commonJS({
  "node_modules/@onflow/util-address/dist/util-address.js"(exports) {
    init_shims();
    function sansPrefix(address) {
      if (address == null)
        return null;
      return address.replace(/^0x/, "").replace(/^Fx/, "");
    }
    function withPrefix(address) {
      if (address == null)
        return null;
      return "0x" + sansPrefix(address);
    }
    function display(address) {
      return withPrefix(address);
    }
    exports.display = display;
    exports.sansPrefix = sansPrefix;
    exports.withPrefix = withPrefix;
  }
});

// node_modules/@onflow/transport-http/dist/sdk-send-http.js
var require_sdk_send_http = __commonJS({
  "node_modules/@onflow/transport-http/dist/sdk-send-http.js"(exports) {
    init_shims();
    var utilInvariant = require_util_invariant();
    var utilNodeHttpModules = require_util_node_http_modules();
    var utilAddress = require_util_address();
    function _defineProperties(target, props) {
      for (var i3 = 0; i3 < props.length; i3++) {
        var descriptor = props[i3];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct)
        return false;
      if (Reflect.construct.sham)
        return false;
      if (typeof Proxy === "function")
        return true;
      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
      } catch (e2) {
        return false;
      }
    }
    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct2(Parent2, args2, Class2) {
          var a = [null];
          a.push.apply(a, args2);
          var Constructor = Function.bind.apply(Parent2, a);
          var instance = new Constructor();
          if (Class2)
            _setPrototypeOf(instance, Class2.prototype);
          return instance;
        };
      }
      return _construct.apply(null, arguments);
    }
    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
      _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
        if (Class2 === null || !_isNativeFunction(Class2))
          return Class2;
        if (typeof Class2 !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
          if (_cache.has(Class2))
            return _cache.get(Class2);
          _cache.set(Class2, Wrapper);
        }
        function Wrapper() {
          return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class2.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return _setPrototypeOf(Wrapper, Class2);
      };
      return _wrapNativeSuper(Class);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function createCommonjsModule(fn) {
      var module3 = { exports: {} };
      return fn(module3, module3.exports), module3.exports;
    }
    var byteLength_1 = byteLength;
    var toByteArray_1 = toByteArray;
    var fromByteArray_1 = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i2 = 0, len = code.length; i2 < len; ++i2) {
      lookup[i2] = code[i2];
      revLookup[code.charCodeAt(i2)] = i2;
    }
    var i2;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1)
        validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i3;
      for (i3 = 0; i3 < len2; i3 += 4) {
        tmp = revLookup[b64.charCodeAt(i3)] << 18 | revLookup[b64.charCodeAt(i3 + 1)] << 12 | revLookup[b64.charCodeAt(i3 + 2)] << 6 | revLookup[b64.charCodeAt(i3 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i3)] << 2 | revLookup[b64.charCodeAt(i3 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i3)] << 10 | revLookup[b64.charCodeAt(i3 + 1)] << 4 | revLookup[b64.charCodeAt(i3 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i3 = start; i3 < end; i3 += 3) {
        tmp = (uint8[i3] << 16 & 16711680) + (uint8[i3 + 1] << 8 & 65280) + (uint8[i3 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i3 = 0, len22 = len2 - extraBytes; i3 < len22; i3 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i3, i3 + maxChunkLength > len22 ? len22 : i3 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
      }
      return parts.join("");
    }
    var base64Js = {
      byteLength: byteLength_1,
      toByteArray: toByteArray_1,
      fromByteArray: fromByteArray_1
    };
    var read2 = function read3(buffer, offset, isLE, mLen, nBytes) {
      var e2, m2;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i3 = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s3 = buffer[offset + i3];
      i3 += d;
      e2 = s3 & (1 << -nBits) - 1;
      s3 >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e2 = e2 * 256 + buffer[offset + i3], i3 += d, nBits -= 8) {
      }
      m2 = e2 & (1 << -nBits) - 1;
      e2 >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m2 = m2 * 256 + buffer[offset + i3], i3 += d, nBits -= 8) {
      }
      if (e2 === 0) {
        e2 = 1 - eBias;
      } else if (e2 === eMax) {
        return m2 ? NaN : (s3 ? -1 : 1) * Infinity;
      } else {
        m2 = m2 + Math.pow(2, mLen);
        e2 = e2 - eBias;
      }
      return (s3 ? -1 : 1) * m2 * Math.pow(2, e2 - mLen);
    };
    var write = function write2(buffer, value, offset, isLE, mLen, nBytes) {
      var e2, m2, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i3 = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s3 = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m2 = isNaN(value) ? 1 : 0;
        e2 = eMax;
      } else {
        e2 = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e2)) < 1) {
          e2--;
          c *= 2;
        }
        if (e2 + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e2++;
          c /= 2;
        }
        if (e2 + eBias >= eMax) {
          m2 = 0;
          e2 = eMax;
        } else if (e2 + eBias >= 1) {
          m2 = (value * c - 1) * Math.pow(2, mLen);
          e2 = e2 + eBias;
        } else {
          m2 = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e2 = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i3] = m2 & 255, i3 += d, m2 /= 256, mLen -= 8) {
      }
      e2 = e2 << mLen | m2;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i3] = e2 & 255, i3 += d, e2 /= 256, eLen -= 8) {
      }
      buffer[offset + i3 - d] |= s3 * 128;
    };
    var ieee754 = {
      read: read2,
      write
    };
    createCommonjsModule(function(module3, exports2) {
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports2.Buffer = Buffer2;
      exports2.SlowBuffer = SlowBuffer;
      exports2.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports2.kMaxLength = K_MAX_LENGTH;
      Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
      }
      function typedArraySupport() {
        try {
          var arr = new Uint8Array(1);
          var proto = {
            foo: function foo() {
              return 42;
            }
          };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e2) {
          return false;
        }
      }
      Object.defineProperty(Buffer2.prototype, "parent", {
        enumerable: true,
        get: function get() {
          if (!Buffer2.isBuffer(this))
            return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer2.prototype, "offset", {
        enumerable: true,
        get: function get() {
          if (!Buffer2.isBuffer(this))
            return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        var buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function Buffer2(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError('The "string" argument must be of type string. Received type number');
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer2.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError('The "value" argument must not be of type number. Received type number');
        }
        var valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer2.from(valueOf, encodingOrOffset, length);
        }
        var b = fromObject(value);
        if (b)
          return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
      }
      Buffer2.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer2, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer2.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer2.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer2.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        var length = byteLength2(string, encoding) | 0;
        var buf = createBuffer(length);
        var actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array2) {
        var length = array2.length < 0 ? 0 : checked(array2.length) | 0;
        var buf = createBuffer(length);
        for (var i3 = 0; i3 < length; i3 += 1) {
          buf[i3] = array2[i3] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          var copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array2, byteOffset, length) {
        if (byteOffset < 0 || array2.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array2.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        var buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array2);
        } else if (length === void 0) {
          buf = new Uint8Array(array2, byteOffset);
        } else {
          buf = new Uint8Array(array2, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer2.isBuffer(obj)) {
          var len2 = checked(obj.length) | 0;
          var buf = createBuffer(len2);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len2);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer2.alloc(+length);
      }
      Buffer2.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer2.prototype;
      };
      Buffer2.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array))
          a = Buffer2.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array))
          b = Buffer2.from(b, b.offset, b.byteLength);
        if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
          throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        }
        if (a === b)
          return 0;
        var x2 = a.length;
        var y = b.length;
        for (var i3 = 0, len2 = Math.min(x2, y); i3 < len2; ++i3) {
          if (a[i3] !== b[i3]) {
            x2 = a[i3];
            y = b[i3];
            break;
          }
        }
        if (x2 < y)
          return -1;
        if (y < x2)
          return 1;
        return 0;
      };
      Buffer2.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer2.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer2.alloc(0);
        }
        var i3;
        if (length === void 0) {
          length = 0;
          for (i3 = 0; i3 < list.length; ++i3) {
            length += list[i3].length;
          }
        }
        var buffer = Buffer2.allocUnsafe(length);
        var pos = 0;
        for (i3 = 0; i3 < list.length; ++i3) {
          var buf = list[i3];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer2.isBuffer(buf))
                buf = Buffer2.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(buffer, buf, pos);
            }
          } else if (!Buffer2.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength2(string, encoding) {
        if (Buffer2.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
        }
        var len2 = string.length;
        var mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len2 === 0)
          return 0;
        var loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len2;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len2 * 2;
            case "hex":
              return len2 >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.byteLength = byteLength2;
      function slowToString(encoding, start, end) {
        var loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding)
          encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase)
                throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.prototype._isBuffer = true;
      function swap(b, n, m2) {
        var i3 = b[n];
        b[n] = b[m2];
        b[m2] = i3;
      }
      Buffer2.prototype.swap16 = function swap16() {
        var len2 = this.length;
        if (len2 % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (var i3 = 0; i3 < len2; i3 += 2) {
          swap(this, i3, i3 + 1);
        }
        return this;
      };
      Buffer2.prototype.swap32 = function swap32() {
        var len2 = this.length;
        if (len2 % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (var i3 = 0; i3 < len2; i3 += 4) {
          swap(this, i3, i3 + 3);
          swap(this, i3 + 1, i3 + 2);
        }
        return this;
      };
      Buffer2.prototype.swap64 = function swap64() {
        var len2 = this.length;
        if (len2 % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (var i3 = 0; i3 < len2; i3 += 8) {
          swap(this, i3, i3 + 7);
          swap(this, i3 + 1, i3 + 6);
          swap(this, i3 + 2, i3 + 5);
          swap(this, i3 + 3, i3 + 4);
        }
        return this;
      };
      Buffer2.prototype.toString = function toString() {
        var length = this.length;
        if (length === 0)
          return "";
        if (arguments.length === 0)
          return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
      Buffer2.prototype.equals = function equals(b) {
        if (!Buffer2.isBuffer(b))
          throw new TypeError("Argument must be a Buffer");
        if (this === b)
          return true;
        return Buffer2.compare(this, b) === 0;
      };
      Buffer2.prototype.inspect = function inspect() {
        var str = "";
        var max = exports2.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max)
          str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
      }
      Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer2.from(target, target.offset, target.byteLength);
        }
        if (!Buffer2.isBuffer(target)) {
          throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target)
          return 0;
        var x2 = thisEnd - thisStart;
        var y = end - start;
        var len2 = Math.min(x2, y);
        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);
        for (var i3 = 0; i3 < len2; ++i3) {
          if (thisCopy[i3] !== targetCopy[i3]) {
            x2 = thisCopy[i3];
            y = targetCopy[i3];
            break;
          }
        }
        if (x2 < y)
          return -1;
        if (y < x2)
          return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0)
          return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0)
          byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir)
            return -1;
          else
            byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir)
            byteOffset = 0;
          else
            return -1;
        }
        if (typeof val === "string") {
          val = Buffer2.from(val, encoding);
        }
        if (Buffer2.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read3(buf, i4) {
          if (indexSize === 1) {
            return buf[i4];
          } else {
            return buf.readUInt16BE(i4 * indexSize);
          }
        }
        var i3;
        if (dir) {
          var foundIndex = -1;
          for (i3 = byteOffset; i3 < arrLength; i3++) {
            if (read3(arr, i3) === read3(val, foundIndex === -1 ? 0 : i3 - foundIndex)) {
              if (foundIndex === -1)
                foundIndex = i3;
              if (i3 - foundIndex + 1 === valLength)
                return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1)
                i3 -= i3 - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength)
            byteOffset = arrLength - valLength;
          for (i3 = byteOffset; i3 >= 0; i3--) {
            var found = true;
            for (var j = 0; j < valLength; j++) {
              if (read3(arr, i3 + j) !== read3(val, j)) {
                found = false;
                break;
              }
            }
            if (found)
              return i3;
          }
        }
        return -1;
      }
      Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        var strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        var i3;
        for (i3 = 0; i3 < length; ++i3) {
          var parsed = parseInt(string.substr(i3 * 2, 2), 16);
          if (numberIsNaN(parsed))
            return i3;
          buf[offset + i3] = parsed;
        }
        return i3;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer2.prototype.write = function write2(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0)
              encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        }
        var remaining = this.length - offset;
        if (length === void 0 || length > remaining)
          length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding)
          encoding = "utf8";
        var loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase)
                throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer2.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64Js.fromByteArray(buf);
        } else {
          return base64Js.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];
        var i3 = start;
        while (i3 < end) {
          var firstByte = buf[i3];
          var codePoint = null;
          var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i3 + bytesPerSequence <= end) {
            var secondByte = void 0, thirdByte = void 0, fourthByte = void 0, tempCodePoint = void 0;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i3 + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i3 + 1];
                thirdByte = buf[i3 + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i3 + 1];
                thirdByte = buf[i3 + 2];
                fourthByte = buf[i3 + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i3 += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        var len2 = codePoints.length;
        if (len2 <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        var res = "";
        var i3 = 0;
        while (i3 < len2) {
          res += String.fromCharCode.apply(String, codePoints.slice(i3, i3 += MAX_ARGUMENTS_LENGTH));
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i3 = start; i3 < end; ++i3) {
          ret += String.fromCharCode(buf[i3] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i3 = start; i3 < end; ++i3) {
          ret += String.fromCharCode(buf[i3]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        var len2 = buf.length;
        if (!start || start < 0)
          start = 0;
        if (!end || end < 0 || end > len2)
          end = len2;
        var out = "";
        for (var i3 = start; i3 < end; ++i3) {
          out += hexSliceLookupTable[buf[i3]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = "";
        for (var i3 = 0; i3 < bytes.length - 1; i3 += 2) {
          res += String.fromCharCode(bytes[i3] + bytes[i3 + 1] * 256);
        }
        return res;
      }
      Buffer2.prototype.slice = function slice(start, end) {
        var len2 = this.length;
        start = ~~start;
        end = end === void 0 ? len2 : ~~end;
        if (start < 0) {
          start += len2;
          if (start < 0)
            start = 0;
        } else if (start > len2) {
          start = len2;
        }
        if (end < 0) {
          end += len2;
          if (end < 0)
            end = 0;
        } else if (end > len2) {
          end = len2;
        }
        if (end < start)
          end = start;
        var newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer2.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0)
          throw new RangeError("offset is not uint");
        if (offset + ext > length)
          throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength3, noAssert) {
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength3, this.length);
        var val = this[offset];
        var mul = 1;
        var i3 = 0;
        while (++i3 < byteLength3 && (mul *= 256)) {
          val += this[offset + i3] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength3, this.length);
        }
        var val = this[offset + --byteLength3];
        var mul = 1;
        while (byteLength3 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength3] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        var first = this[offset];
        var last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        var lo = first + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 24);
        var hi = this[++offset] + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + last * Math.pow(2, 24);
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        var first = this[offset];
        var last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        var hi = first * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + this[++offset];
        var lo = this[++offset] * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength3, noAssert) {
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength3, this.length);
        var val = this[offset];
        var mul = 1;
        var i3 = 0;
        while (++i3 < byteLength3 && (mul *= 256)) {
          val += this[offset + i3] * mul;
        }
        mul *= 128;
        if (val >= mul)
          val -= Math.pow(2, 8 * byteLength3);
        return val;
      };
      Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength3, this.length);
        var i3 = byteLength3;
        var mul = 1;
        var val = this[offset + --i3];
        while (i3 > 0 && (mul *= 256)) {
          val += this[offset + --i3] * mul;
        }
        mul *= 128;
        if (val >= mul)
          val -= Math.pow(2, 8 * byteLength3);
        return val;
      };
      Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128))
          return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        var first = this[offset];
        var last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        var val = this[offset + 4] + this[offset + 5] * Math.pow(2, 8) + this[offset + 6] * Math.pow(2, 16) + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 24));
      });
      Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        var first = this[offset];
        var last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        var val = (first << 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + last);
      });
      Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer2.isBuffer(buf))
          throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min)
          throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length)
          throw new RangeError("Index out of range");
      }
      Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength3, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength3) - 1;
          checkInt(this, value, offset, byteLength3, maxBytes, 0);
        }
        var mul = 1;
        var i3 = 0;
        this[offset] = value & 255;
        while (++i3 < byteLength3 && (mul *= 256)) {
          this[offset + i3] = value / mul & 255;
        }
        return offset + byteLength3;
      };
      Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength3, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength3 = byteLength3 >>> 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength3) - 1;
          checkInt(this, value, offset, byteLength3, maxBytes, 0);
        }
        var i3 = byteLength3 - 1;
        var mul = 1;
        this[offset + i3] = value & 255;
        while (--i3 >= 0 && (mul *= 256)) {
          this[offset + i3] = value / mul & 255;
        }
        return offset + byteLength3;
      };
      Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        var lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        var hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        var lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        var hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength3, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength3 - 1);
          checkInt(this, value, offset, byteLength3, limit - 1, -limit);
        }
        var i3 = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = value & 255;
        while (++i3 < byteLength3 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i3 - 1] !== 0) {
            sub = 1;
          }
          this[offset + i3] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength3;
      };
      Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength3, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength3 - 1);
          checkInt(this, value, offset, byteLength3, limit - 1, -limit);
        }
        var i3 = byteLength3 - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i3] = value & 255;
        while (--i3 >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i3 + 1] !== 0) {
            sub = 1;
          }
          this[offset + i3] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength3;
      };
      Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 1, 127, -128);
        if (value < 0)
          value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0)
          value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length)
          throw new RangeError("Index out of range");
        if (offset < 0)
          throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer2.isBuffer(target))
          throw new TypeError("argument should be a Buffer");
        if (!start)
          start = 0;
        if (!end && end !== 0)
          end = this.length;
        if (targetStart >= target.length)
          targetStart = target.length;
        if (!targetStart)
          targetStart = 0;
        if (end > 0 && end < start)
          end = start;
        if (end === start)
          return 0;
        if (target.length === 0 || this.length === 0)
          return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length)
          throw new RangeError("Index out of range");
        if (end < 0)
          throw new RangeError("sourceEnd out of bounds");
        if (end > this.length)
          end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        var len2 = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
        }
        return len2;
      };
      Buffer2.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            var code2 = val.charCodeAt(0);
            if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
              val = code2;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val)
          val = 0;
        var i3;
        if (typeof val === "number") {
          for (i3 = start; i3 < end; ++i3) {
            this[i3] = val;
          }
        } else {
          var bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
          var len2 = bytes.length;
          if (len2 === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i3 = 0; i3 < end - start; ++i3) {
            this[i3 + start] = bytes[i3 % len2];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = /* @__PURE__ */ function(_Base) {
          _inheritsLoose(NodeError, _Base);
          function NodeError() {
            var _this;
            _this = _Base.call(this) || this;
            Object.defineProperty(_assertThisInitialized(_this), "message", {
              value: getMessage.apply(_assertThisInitialized(_this), arguments),
              writable: true,
              configurable: true
            });
            _this.name = _this.name + " [" + sym + "]";
            delete _this.name;
            return _this;
          }
          var _proto = NodeError.prototype;
          _proto.toString = function toString() {
            return this.name + " [" + sym + "]: " + this.message;
          };
          _createClass(NodeError, [{
            key: "code",
            get: function get() {
              return sym;
            },
            set: function set(value) {
              Object.defineProperty(this, "code", {
                configurable: true,
                enumerable: true,
                value,
                writable: true
              });
            }
          }]);
          return NodeError;
        }(Base);
      }
      E("ERR_BUFFER_OUT_OF_BOUNDS", function(name) {
        if (name) {
          return name + " is outside of buffer bounds";
        }
        return "Attempt to access memory outside buffer bounds";
      }, RangeError);
      E("ERR_INVALID_ARG_TYPE", function(name, actual) {
        return 'The "' + name + '" argument must be of type number. Received type ' + typeof actual;
      }, TypeError);
      E("ERR_OUT_OF_RANGE", function(str, range, input) {
        var msg = 'The value of "' + str + '" is out of range.';
        var received = input;
        if (Number.isInteger(input) && Math.abs(input) > Math.pow(2, 32)) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > Math.pow(BigInt(2), BigInt(32)) || input < -Math.pow(BigInt(2), BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += " It must be " + range + ". Received " + received;
        return msg;
      }, RangeError);
      function addNumericalSeparator(val) {
        var res = "";
        var i3 = val.length;
        var start = val[0] === "-" ? 1 : 0;
        for (; i3 >= start + 4; i3 -= 3) {
          res = "_" + val.slice(i3 - 3, i3) + res;
        }
        return "" + val.slice(0, i3) + res;
      }
      function checkBounds(buf, offset, byteLength3) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength3] === void 0) {
          boundsError(offset, buf.length - (byteLength3 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength3) {
        if (value > max || value < min) {
          var n = typeof min === "bigint" ? "n" : "";
          var range;
          if (byteLength3 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = ">= 0" + n + " and < 2" + n + " ** " + (byteLength3 + 1) * 8 + n;
            } else {
              range = ">= -(2" + n + " ** " + ((byteLength3 + 1) * 8 - 1) + n + ") and < 2 ** " + ("" + ((byteLength3 + 1) * 8 - 1) + n);
            }
          } else {
            range = ">= " + min + n + " and <= " + max + n;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength3);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", ">= " + (type ? 1 : 0) + " and <= " + length, value);
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2)
          return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];
        for (var i3 = 0; i3 < length; ++i3) {
          codePoint = string.charCodeAt(i3);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1)
                  bytes.push(239, 191, 189);
                continue;
              } else if (i3 + 1 === length) {
                if ((units -= 3) > -1)
                  bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0)
              break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0)
              break;
            bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0)
              break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0)
              break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        var byteArray = [];
        for (var i3 = 0; i3 < str.length; ++i3) {
          byteArray.push(str.charCodeAt(i3) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];
        for (var i3 = 0; i3 < str.length; ++i3) {
          if ((units -= 2) < 0)
            break;
          c = str.charCodeAt(i3);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64Js.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        var i3;
        for (i3 = 0; i3 < length; ++i3) {
          if (i3 + offset >= dst.length || i3 >= src.length)
            break;
          dst[i3 + offset] = src[i3];
        }
        return i3;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = function() {
        var alphabet = "0123456789abcdef";
        var table = new Array(256);
        for (var i3 = 0; i3 < 16; ++i3) {
          var i16 = i3 * 16;
          for (var j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i3] + alphabet[j];
          }
        }
        return table;
      }();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    });
    function _catch(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var httpRequest = function httpRequest2(_ref2) {
      var hostname = _ref2.hostname, path = _ref2.path, method = _ref2.method, body = _ref2.body, _ref2$retryLimit = _ref2.retryLimit, retryLimit = _ref2$retryLimit === void 0 ? 5 : _ref2$retryLimit, _ref2$retryIntervalMs = _ref2.retryIntervalMs, retryIntervalMs = _ref2$retryIntervalMs === void 0 ? 1e3 : _ref2$retryIntervalMs;
      try {
        var isHTTPs = hostname.substring(0, 5) === "https";
        var fetchTransport;
        try {
          var _window;
          fetchTransport = fetch || ((_window = window) == null ? void 0 : _window.fetch);
        } catch (e2) {
        }
        return Promise.resolve(utilNodeHttpModules.getNodeHttpModules()).then(function(_ref3) {
          var requestLoop = function requestLoop2(retryAttempt) {
            if (retryAttempt === void 0) {
              retryAttempt = 0;
            }
            try {
              return Promise.resolve(_catch(makeRequest, function(error2) {
                var retryStatusCodes = [500, 502, 503, 504];
                if (retryStatusCodes.includes(error2.statusCode)) {
                  return Promise.resolve(new Promise(function(resolve2, reject) {
                    if (retryAttempt < retryLimit) {
                      console.log("Access node unavailable, retrying in " + retryIntervalMs + " ms...");
                      setTimeout(function() {
                        resolve2(requestLoop2(retryAttempt + 1));
                      }, retryIntervalMs);
                    } else {
                      throw error2;
                    }
                  }));
                } else {
                  throw error2;
                }
              }));
            } catch (e2) {
              return Promise.reject(e2);
            }
          };
          var nodeHttpsTransport = _ref3.nodeHttpsTransport, nodeHttpTransport = _ref3.nodeHttpTransport;
          function makeRequest() {
            if (fetchTransport) {
              return fetchTransport("" + hostname + path, {
                method,
                body: body ? JSON.stringify(body) : void 0
              }).then(function(res) {
                try {
                  if (res.ok) {
                    return Promise.resolve(res.json());
                  }
                  return Promise.resolve(res.json()).then(function(_res$json) {
                    var responseJSON = JSON.stringify(_res$json);
                    throw new HTTPRequestError({
                      transport: "FetchTransport",
                      error: responseJSON == null ? void 0 : responseJSON.message,
                      hostname,
                      path,
                      method,
                      requestBody: body,
                      responseBody: responseJSON,
                      responseStatusText: res.statusText,
                      statusCode: res.status
                    });
                  });
                } catch (e2) {
                  return Promise.reject(e2);
                }
              })["catch"](function(e2) {
                if (e2 instanceof HTTPRequestError) {
                  throw e2;
                }
                throw new HTTPRequestError({
                  transport: "FetchTransport",
                  error: e2 == null ? void 0 : e2.message,
                  hostname,
                  path,
                  method,
                  requestBody: body
                });
              });
            } else if (nodeHttpsTransport && nodeHttpTransport) {
              return new Promise(function(resolve2, reject) {
                var hostnameParts = hostname.split(":");
                var port = hostnameParts.length == 3 ? hostnameParts[2] : void 0;
                var parsedHostname = hostnameParts.length > 1 ? hostnameParts[1].substring(2) : hostnameParts[0];
                var transport = isHTTPs ? nodeHttpsTransport : nodeHttpTransport;
                var bodyString = body ? JSON.stringify(body) : null;
                var options = {
                  hostname: parsedHostname,
                  path,
                  port,
                  method,
                  headers: body ? {
                    "Content-Type": "application/json",
                    "Content-Length": bodyString.length
                  } : void 0
                };
                var responseBody = [];
                var req = transport.request(options, function(res) {
                  res.setEncoding("utf8");
                  res.on("data", function(dataChunk) {
                    responseBody.push(dataChunk);
                  });
                  res.on("end", function() {
                    try {
                      responseBody = JSON.parse(responseBody.join(""));
                      if (res != null && res.statusCode && (Number(res == null ? void 0 : res.statusCode) < 200 || Number(res == null ? void 0 : res.statusCode) >= 300)) {
                        throw new HTTPRequestError({
                          transport: isHTTPs ? "NodeHTTPsTransport" : "NodeHTTPTransport",
                          error: JSON.stringify(responseBody),
                          hostname: parsedHostname,
                          path,
                          port,
                          method,
                          requestBody: body ? JSON.stringify(body) : null,
                          responseBody: JSON.stringify(responseBody),
                          reqOn: "end",
                          statusCode: res == null ? void 0 : res.statusCode
                        });
                      }
                    } catch (e2) {
                      if (e2 instanceof HTTPRequestError) {
                        throw e2;
                      }
                      throw new HTTPRequestError({
                        transport: isHTTPs ? "NodeHTTPsTransport" : "NodeHTTPTransport",
                        error: e2,
                        hostname: parsedHostname,
                        path,
                        port,
                        method,
                        reqOn: "end"
                      });
                    }
                    resolve2(responseBody);
                  });
                });
                req.on("error", function(e2) {
                  throw new HTTPRequestError({
                    transport: isHTTPs ? "NodeHTTPsTransport" : "NodeHTTPTransport",
                    error: e2,
                    hostname: parsedHostname,
                    path,
                    port,
                    method,
                    requestBody: body,
                    responseBody,
                    reqOn: "error"
                  });
                });
                if (body)
                  req.write(bodyString);
                req.end();
              });
            }
          }
          utilInvariant.invariant(fetchTransport || nodeHttpsTransport || nodeHttpTransport, "HTTP Request error: Could not find a supported HTTP module.");
          return Promise.resolve(requestLoop());
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var HTTPRequestError = /* @__PURE__ */ function(_Error) {
      _inheritsLoose(HTTPRequestError2, _Error);
      function HTTPRequestError2(_ref) {
        var _this;
        var transport = _ref.transport, error2 = _ref.error, hostname = _ref.hostname, path = _ref.path, method = _ref.method, requestBody = _ref.requestBody, responseBody = _ref.responseBody, responseStatusText = _ref.responseStatusText, reqOn = _ref.reqOn, statusCode = _ref.statusCode;
        var msg = "\n      HTTP Request Error: An error occurred when interacting with the Access API.\n      " + (transport ? "transport=" + transport : "") + "\n      " + (error2 ? "error=" + error2 : "") + "\n      " + (hostname ? "hostname=" + hostname : "") + "\n      " + (path ? "path=" + path : "") + "\n      " + (method ? "method=" + method : "") + "\n      " + (requestBody ? "requestBody=" + JSON.stringify(requestBody) : "") + "\n      " + (responseBody ? "responseBody=" + responseBody : "") + "\n      " + (responseStatusText ? "responseStatusText=" + responseStatusText : "") + "\n      " + (reqOn ? "reqOn=" + reqOn : "") + "\n      " + (statusCode ? "statusCode=" + statusCode : "") + "\n    ";
        _this = _Error.call(this, msg) || this;
        _this.name = "HTTP Request Error";
        _this.statusCode = statusCode;
        return _this;
      }
      return HTTPRequestError2;
    }(/* @__PURE__ */ _wrapNativeSuper(Error));
    var sendExecuteScript = function sendExecuteScript2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Execute Script Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Execute Script Error: context.response must be defined.");
        utilInvariant.invariant(context.Buffer, "SDK Send Execute Script Error: context.Buffer must be defined.");
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          if (ix.block.id) {
            return Promise.resolve(sendExecuteScriptAtBlockIDRequest(ix, context, opts));
          } else if (ix.block.height) {
            return Promise.resolve(sendExecuteScriptAtBlockHeightRequest(ix, context, opts));
          } else {
            return Promise.resolve(sendExecuteScriptAtLatestBlockRequest(ix, context, opts));
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendExecuteScriptAtLatestBlockRequest = function sendExecuteScriptAtLatestBlockRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/scripts?block_height=sealed",
          method: "POST",
          body: {
            "script": context.Buffer.from(ix.message.cadence).toString("base64"),
            "arguments": ix.message.arguments.map(function(arg) {
              return context.Buffer.from(JSON.stringify(ix.arguments[arg].asArgument)).toString("base64");
            })
          }
        })).then(function(res) {
          return constructResponse$4(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendExecuteScriptAtBlockHeightRequest = function sendExecuteScriptAtBlockHeightRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/scripts?block_height=" + ix.block.height,
          method: "POST",
          body: {
            "script": context.Buffer.from(ix.message.cadence).toString("base64"),
            "arguments": ix.message.arguments.map(function(arg) {
              return context.Buffer.from(JSON.stringify(ix.arguments[arg].asArgument)).toString("base64");
            })
          }
        })).then(function(res) {
          return constructResponse$4(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendExecuteScriptAtBlockIDRequest = function sendExecuteScriptAtBlockIDRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/scripts?block_id=" + ix.block.id,
          method: "POST",
          body: {
            "script": context.Buffer.from(ix.message.cadence).toString("base64"),
            "arguments": ix.message.arguments.map(function(arg) {
              return context.Buffer.from(JSON.stringify(ix.arguments[arg].asArgument)).toString("base64");
            })
          }
        })).then(function(res) {
          return constructResponse$4(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function constructResponse$4(ix, context, res) {
      var ret = context.response();
      ret.tag = ix.tag;
      ret.encodedData = JSON.parse(context.Buffer.from(res, "base64").toString());
      return ret;
    }
    var sendGetAccount = function sendGetAccount2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Get Account Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Get Account Error: context.response must be defined.");
        utilInvariant.invariant(context.Buffer, "SDK Send Get Account Error: context.Buffer must be defined.");
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          if (ix.block.height !== null) {
            return Promise.resolve(sendGetAccountAtBlockHeightRequest(ix, context, opts));
          } else {
            return Promise.resolve(sendGetAccountAtLatestBlockRequest(ix, context, opts));
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetAccountAtLatestBlockRequest = function sendGetAccountAtLatestBlockRequest2(ix, context, opts) {
      try {
        var _ix$block;
        var httpRequest$1 = opts.httpRequest || httpRequest;
        var height = (_ix$block = ix.block) != null && _ix$block.isSealed ? "sealed" : "final";
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/accounts/" + ix.account.addr + "?block_height=" + height + "&expand=contracts,keys",
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse$3(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetAccountAtBlockHeightRequest = function sendGetAccountAtBlockHeightRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/accounts/" + ix.account.addr + "?block_height=" + ix.block.height + "&expand=contracts,keys",
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse$3(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var HashAlgorithmIDs = {
      "SHA2_256": 1,
      "SHA2_384": 2,
      "SHA3_256": 3,
      "SHA3_384": 4,
      "KMAC128_BLS_BLS12_381": 5
    };
    var SignatureAlgorithmIDs = {
      "ECDSA_P256": 1,
      "ECDSA_secp256k1": 2,
      "BLS_BLS12_381": 3
    };
    function constructResponse$3(ix, context, res) {
      var ret = context.response();
      ret.tag = ix.tag;
      var unwrapContracts = function unwrapContracts2(contracts) {
        var c = {};
        if (!contracts)
          return c;
        for (var _i = 0, _Object$keys = Object.keys(contracts); _i < _Object$keys.length; _i++) {
          var key2 = _Object$keys[_i];
          c[key2] = context.Buffer.from(contracts[key2], "base64").toString();
        }
        return c;
      };
      ret.account = {
        address: res.address,
        balance: Number(res.balance),
        code: "",
        contracts: unwrapContracts(res.contracts),
        keys: res.keys.map(function(key2) {
          return {
            index: Number(key2.index),
            publicKey: key2.public_key.replace(/^0x/, ""),
            signAlgo: SignatureAlgorithmIDs[key2.signing_algorithm],
            signAlgoString: key2.signing_algorithm,
            hashAlgo: HashAlgorithmIDs[key2.hashing_algorithm],
            hashAlgoString: key2.hashing_algorithm,
            sequenceNumber: Number(key2.sequence_number),
            weight: Number(key2.weight),
            revoked: key2.revoked
          };
        })
      };
      return ret;
    }
    var sendGetBlockHeader = function sendGetBlockHeader2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Get Block Header Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Get Block Header Error: context.response must be defined.");
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          var interactionHasBlockID = ix.block.id !== null;
          var interactionHasBlockHeight = ix.block.height !== null;
          if (interactionHasBlockID) {
            return Promise.resolve(sendGetBlockHeaderByIDRequest(ix, context, opts));
          } else if (interactionHasBlockHeight) {
            return Promise.resolve(sendGetBlockHeaderByHeightRequest(ix, context, opts));
          } else {
            return Promise.resolve(sendGetLatestBlockHeaderRequest(ix, context, opts));
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetLatestBlockHeaderRequest = function sendGetLatestBlockHeaderRequest2(ix, context, opts) {
      try {
        var _ix$block;
        var httpRequest$1 = opts.httpRequest || httpRequest;
        var height = (_ix$block = ix.block) != null && _ix$block.isSealed ? "sealed" : "finalized";
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/blocks?height=" + height,
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse$2(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetBlockHeaderByHeightRequest = function sendGetBlockHeaderByHeightRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/blocks?height=" + ix.block.height,
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse$2(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetBlockHeaderByIDRequest = function sendGetBlockHeaderByIDRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/blocks/" + ix.block.id,
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse$2(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function constructResponse$2(ix, context, res) {
      var block = res.length ? res[0] : null;
      var ret = context.response();
      ret.tag = ix.tag;
      ret.blockHeader = {
        id: block.header.id,
        parentId: block.header.parent_id,
        height: Number(block.header.height),
        timestamp: block.header.timestamp
      };
      return ret;
    }
    var sendGetBlock = function sendGetBlock2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Get Block Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Get Block Error: context.response must be defined.");
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          var interactionHasBlockID = ix.block.id !== null;
          var interactionHasBlockHeight = ix.block.height !== null;
          if (interactionHasBlockID) {
            return Promise.resolve(sendGetBlockByIDRequest(ix, context, opts));
          } else if (interactionHasBlockHeight) {
            return Promise.resolve(sendGetBlockByHeightRequest(ix, context, opts));
          } else {
            return Promise.resolve(sendGetBlockRequest(ix, context, opts));
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetBlockRequest = function sendGetBlockRequest2(ix, context, opts) {
      try {
        var _ix$block;
        var httpRequest$1 = opts.httpRequest || httpRequest;
        var height = (_ix$block = ix.block) != null && _ix$block.isSealed ? "sealed" : "final";
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/blocks?height=" + height + "&expand=payload",
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse$1(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetBlockByHeightRequest = function sendGetBlockByHeightRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/blocks?height=" + ix.block.height + "&expand=payload",
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse$1(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetBlockByIDRequest = function sendGetBlockByIDRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/blocks/" + ix.block.id + "?expand=payload",
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse$1(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function constructResponse$1(ix, context, res) {
      var block = res.length ? res[0] : null;
      var ret = context.response();
      ret.tag = ix.tag;
      ret.block = {
        id: block.header.id,
        parentId: block.header.parent_id,
        height: Number(block.header.height),
        timestamp: block.header.timestamp,
        collectionGuarantees: block.payload.collection_guarantees.map(function(collectionGuarantee) {
          return {
            collectionId: collectionGuarantee.collection_id,
            signerIds: collectionGuarantee.signer_ids
          };
        }),
        blockSeals: block.payload.block_seals.map(function(blockSeal) {
          return {
            blockId: blockSeal.block_id,
            executionReceiptId: blockSeal.result_id
          };
        })
      };
      return ret;
    }
    var sendGetCollection = function sendGetCollection2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Get Collection Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Get Collection Error: context.response must be defined.");
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/collections/" + ix.collection.id + "?expand=transactions",
          method: "GET",
          body: null
        })).then(function(res) {
          var ret = context.response();
          ret.tag = ix.tag;
          ret.collection = {
            id: res.id,
            transactionIds: res.transactions.map(function(transaction) {
              return transaction.id;
            })
          };
          return ret;
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetEvents = function sendGetEvents2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Get Events Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Get Events Error: context.response must be defined.");
        utilInvariant.invariant(context.Buffer, "SDK Send Get Events Error: context.Buffer must be defined.");
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          var interactionContainsBlockHeightRange = ix.events.start !== null;
          var interactionContainsBlockIDsList = Array.isArray(ix.events.blockIds) && ix.events.blockIds.length > 0;
          utilInvariant.invariant(interactionContainsBlockHeightRange || interactionContainsBlockIDsList, "SendGetEventsError: Unable to determine which get events request to send. Either a block height range, or block IDs must be specified.");
          if (interactionContainsBlockHeightRange) {
            return Promise.resolve(sendGetEventsForHeightRangeRequest(ix, context, opts));
          } else {
            return Promise.resolve(sendGetEventsForBlockIDsRequest(ix, context, opts));
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetEventsForBlockIDsRequest = function sendGetEventsForBlockIDsRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/events?type=" + ix.events.eventType + "&block_ids=" + ix.events.blockIds.join(","),
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetEventsForHeightRangeRequest = function sendGetEventsForHeightRangeRequest2(ix, context, opts) {
      try {
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/events?type=" + ix.events.eventType + "&start_height=" + ix.events.start + "&end_height=" + ix.events.end,
          method: "GET",
          body: null
        })).then(function(res) {
          return constructResponse(ix, context, res);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function constructResponse(ix, context, res) {
      var ret = context.response();
      ret.tag = ix.tag;
      ret.events = [];
      res.forEach(function(block) {
        return block.events ? block.events.forEach(function(event) {
          return ret.events.push({
            blockId: block.block_id,
            blockHeight: Number(block.block_height),
            blockTimestamp: block.block_timestamp,
            type: event.type,
            transactionId: event.transaction_id,
            transactionIndex: Number(event.transaction_index),
            eventIndex: Number(event.event_index),
            payload: JSON.parse(context.Buffer.from(event.payload, "base64").toString())
          });
        }) : null;
      });
      return ret;
    }
    var sendGetTransaction = function sendGetTransaction2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Get Transaction Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Get Transaction Error: context.response must be defined.");
        utilInvariant.invariant(context.Buffer, "SDK Send Get Transaction Error: context.Buffer must be defined.");
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          return Promise.resolve(httpRequest$1({
            hostname: opts.node,
            path: "/v1/transactions/" + ix.transaction.id,
            method: "GET",
            body: null
          })).then(function(res) {
            var unwrapKey = function unwrapKey2(key2) {
              return {
                address: key2.address,
                keyId: Number(key2.key_id),
                sequenceNumber: Number(key2.sequence_number)
              };
            };
            var unwrapSignature = function unwrapSignature2(sig) {
              return {
                address: sig.address,
                keyId: Number(sig.key_index),
                signature: sig.signature
              };
            };
            var unwrapArg = function unwrapArg2(arg) {
              return JSON.parse(context.Buffer.from(arg, "base64").toString());
            };
            var ret = context.response();
            ret.tag = ix.tag;
            ret.transaction = {
              script: context.Buffer.from(res.script, "base64").toString(),
              args: [].concat(res.arguments.map(unwrapArg)),
              referenceBlockId: res.reference_block_id,
              gasLimit: Number(res.gas_limit),
              payer: res.payer,
              proposalKey: res.proposal_key ? unwrapKey(res.proposal_key) : res.proposal_key,
              authorizers: res.authorizers,
              payloadSignatures: [].concat(res.payload_signatures.map(unwrapSignature)),
              envelopeSignatures: [].concat(res.envelope_signatures.map(unwrapSignature))
            };
            return ret;
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendGetTransactionStatus = function sendGetTransactionStatus2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Get Transaction Status Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Get Transaction Status Error: context.response must be defined.");
        utilInvariant.invariant(context.Buffer, "SDK Send Get Transaction Status Error: context.Buffer must be defined.");
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          return Promise.resolve(httpRequest$1({
            hostname: opts.node,
            path: "/v1/transaction_results/" + ix.transaction.id,
            method: "GET",
            body: null
          })).then(function(res) {
            var ret = context.response();
            ret.tag = ix.tag;
            ret.transactionStatus = {
              blockId: res.block_id,
              status: STATUS_MAP[res.status.toUpperCase()] || "",
              statusString: res.status.toUpperCase(),
              statusCode: res.status_code,
              errorMessage: res.error_message,
              events: res.events.map(function(event) {
                return {
                  type: event.type,
                  transactionId: event.transaction_id,
                  transactionIndex: Number(event.transaction_index),
                  eventIndex: Number(event.event_index),
                  payload: JSON.parse(context.Buffer.from(event.payload, "base64").toString())
                };
              })
            };
            return ret;
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var STATUS_MAP = {
      UNKNOWN: 0,
      PENDING: 1,
      FINALIZED: 2,
      EXECUTED: 3,
      SEALED: 4,
      EXPIRED: 5
    };
    var sendPing = function sendPing2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Ping Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Ping Error: context.response must be defined.");
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(httpRequest$1({
          hostname: opts.node,
          path: "/v1/blocks?height=sealed",
          method: "GET",
          body: null
        })).then(function() {
          var ret = context.response();
          ret.tag = ix.tag;
          return ret;
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var sendTransaction = function sendTransaction2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, "SDK Send Transaction Error: opts.node must be defined.");
        utilInvariant.invariant(context.response, "SDK Send Transaction Error: context.response must be defined.");
        utilInvariant.invariant(context.Buffer, "SDK Send Transaction Error: context.Buffer must be defined.");
        var httpRequest$1 = opts.httpRequest || httpRequest;
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          var payloadSignatures = [];
          for (var _i = 0, _Object$values = Object.values(ix.accounts); _i < _Object$values.length; _i++) {
            var acct = _Object$values[_i];
            try {
              if (!acct.role.payer && acct.signature != null) {
                payloadSignatures.push({
                  address: utilAddress.sansPrefix(acct.addr),
                  key_index: String(acct.keyId),
                  signature: context.Buffer.from(acct.signature, "hex").toString("base64")
                });
              }
            } catch (error2) {
              console.error("SDK HTTP Send Error: Trouble applying payload signature", {
                acct,
                ix
              });
              throw error2;
            }
          }
          var envelopeSignatures = {};
          for (var _i2 = 0, _Object$values2 = Object.values(ix.accounts); _i2 < _Object$values2.length; _i2++) {
            var _acct = _Object$values2[_i2];
            try {
              if (_acct.role.payer && _acct.signature != null) {
                var id = _acct.tempId || _acct.addr + "-" + _acct.keyId;
                envelopeSignatures[id] = envelopeSignatures[id] || {
                  address: utilAddress.sansPrefix(_acct.addr),
                  key_index: String(_acct.keyId),
                  signature: context.Buffer.from(_acct.signature, "hex").toString("base64")
                };
              }
            } catch (error2) {
              console.error("SDK HTTP Send Error: Trouble applying envelope signature", {
                acct: _acct,
                ix
              });
              throw error2;
            }
          }
          envelopeSignatures = Object.values(envelopeSignatures);
          var t1 = Date.now();
          return Promise.resolve(httpRequest$1({
            hostname: opts.node,
            path: "/v1/transactions",
            method: "POST",
            body: {
              script: context.Buffer.from(ix.message.cadence).toString("base64"),
              "arguments": [].concat(ix.message.arguments.map(function(arg) {
                return context.Buffer.from(JSON.stringify(ix.arguments[arg].asArgument)).toString("base64");
              })),
              reference_block_id: ix.message.refBlock ? ix.message.refBlock : null,
              gas_limit: String(ix.message.computeLimit),
              payer: utilAddress.sansPrefix(ix.accounts[Array.isArray(ix.payer) ? ix.payer[0] : ix.payer].addr),
              proposal_key: {
                address: utilAddress.sansPrefix(ix.accounts[ix.proposer].addr),
                key_index: String(ix.accounts[ix.proposer].keyId),
                sequence_number: String(ix.accounts[ix.proposer].sequenceNum)
              },
              authorizers: ix.authorizations.map(function(tempId) {
                return ix.accounts[tempId].addr;
              }).reduce(function(prev, current) {
                return prev.find(function(item) {
                  return item === current;
                }) ? prev : [].concat(prev, [current]);
              }, []).map(utilAddress.sansPrefix),
              payload_signatures: payloadSignatures,
              envelope_signatures: envelopeSignatures
            }
          })).then(function(res) {
            var t2 = Date.now();
            var ret = context.response();
            ret.tag = ix.tag;
            ret.transactionId = res.id;
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("FLOW::TX", {
                detail: {
                  txId: ret.transactionId,
                  delta: t2 - t1
                }
              }));
            }
            return ret;
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var send = function send2(ix, context, opts) {
      if (context === void 0) {
        context = {};
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        utilInvariant.invariant(opts.node, 'SDK Send Error: Either opts.node or "accessNode.api" in config must be defined.');
        utilInvariant.invariant(context.ix, "SDK Send Error: context.ix must be defined.");
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          switch (true) {
            case context.ix.isTransaction(ix):
              return opts.sendTransaction ? opts.sendTransaction(ix, context, opts) : sendTransaction(ix, context, opts);
            case context.ix.isGetTransactionStatus(ix):
              return opts.sendGetTransactionStatus ? opts.sendGetTransactionStatus(ix, context, opts) : sendGetTransactionStatus(ix, context, opts);
            case context.ix.isGetTransaction(ix):
              return opts.sendGetTransaction ? opts.sendGetTransaction(ix, context, opts) : sendGetTransaction(ix, context, opts);
            case context.ix.isScript(ix):
              return opts.sendExecuteScript ? opts.sendExecuteScript(ix, context, opts) : sendExecuteScript(ix, context, opts);
            case context.ix.isGetAccount(ix):
              return opts.sendGetAccount ? opts.sendGetAccount(ix, context, opts) : sendGetAccount(ix, context, opts);
            case context.ix.isGetEvents(ix):
              return opts.sendGetEvents ? opts.sendGetEvents(ix, context, opts) : sendGetEvents(ix, context, opts);
            case context.ix.isGetBlock(ix):
              return opts.sendGetBlock ? opts.sendGetBlock(ix, context, opts) : sendGetBlock(ix, context, opts);
            case context.ix.isGetBlockHeader(ix):
              return opts.sendGetBlockHeader ? opts.sendGetBlockHeader(ix, context, opts) : sendGetBlockHeader(ix, context, opts);
            case context.ix.isGetCollection(ix):
              return opts.sendGetCollection ? opts.sendGetCollection(ix, context, opts) : sendGetCollection(ix, context, opts);
            case context.ix.isPing(ix):
              return opts.sendPing ? opts.sendPing(ix, context, opts) : sendPing(ix, context, opts);
            default:
              return ix;
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    exports.send = send;
    exports.sendExecuteScript = sendExecuteScript;
    exports.sendGetAccount = sendGetAccount;
    exports.sendGetBlock = sendGetBlock;
    exports.sendGetBlockHeader = sendGetBlockHeader;
    exports.sendGetCollection = sendGetCollection;
    exports.sendGetEvents = sendGetEvents;
    exports.sendGetTransaction = sendGetTransaction;
    exports.sendGetTransactionStatus = sendGetTransactionStatus;
    exports.sendPing = sendPing;
    exports.sendTransaction = sendTransaction;
  }
});

// node_modules/sha3/sponge/permute/copy/index.js
var require_copy = __commonJS({
  "node_modules/sha3/sponge/permute/copy/index.js"(exports, module2) {
    "use strict";
    init_shims();
    var copy = function copy2(I, i2) {
      return function(O, o) {
        var oi = o * 2;
        var ii = i2 * 2;
        O[oi] = I[ii];
        O[oi + 1] = I[ii + 1];
      };
    };
    module2.exports = copy;
  }
});

// node_modules/sha3/sponge/permute/chi/index.js
var require_chi = __commonJS({
  "node_modules/sha3/sponge/permute/chi/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = void 0;
    var _copy = _interopRequireDefault(require_copy());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var chi = function chi2(_ref) {
      var A2 = _ref.A, C = _ref.C;
      for (var y = 0; y < 25; y += 5) {
        for (var x2 = 0; x2 < 5; x2++) {
          (0, _copy["default"])(A2, y + x2)(C, x2);
        }
        for (var _x = 0; _x < 5; _x++) {
          var xy = (y + _x) * 2;
          var x1 = (_x + 1) % 5 * 2;
          var x22 = (_x + 2) % 5 * 2;
          A2[xy] ^= ~C[x1] & C[x22];
          A2[xy + 1] ^= ~C[x1 + 1] & C[x22 + 1];
        }
      }
    };
    var _default = chi;
    exports["default"] = _default;
  }
});

// node_modules/sha3/sponge/permute/iota/round-constants/index.js
var require_round_constants = __commonJS({
  "node_modules/sha3/sponge/permute/iota/round-constants/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = void 0;
    var ROUND_CONSTANTS = new Uint32Array([0, 1, 0, 32898, 2147483648, 32906, 2147483648, 2147516416, 0, 32907, 0, 2147483649, 2147483648, 2147516545, 2147483648, 32777, 0, 138, 0, 136, 0, 2147516425, 0, 2147483658, 0, 2147516555, 2147483648, 139, 2147483648, 32905, 2147483648, 32771, 2147483648, 32770, 2147483648, 128, 0, 32778, 2147483648, 2147483658, 2147483648, 2147516545, 2147483648, 32896, 0, 2147483649, 2147483648, 2147516424]);
    var _default = ROUND_CONSTANTS;
    exports["default"] = _default;
  }
});

// node_modules/sha3/sponge/permute/iota/index.js
var require_iota = __commonJS({
  "node_modules/sha3/sponge/permute/iota/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = void 0;
    var _roundConstants = _interopRequireDefault(require_round_constants());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var iota = function iota2(_ref) {
      var A2 = _ref.A, roundIndex = _ref.roundIndex;
      var i2 = roundIndex * 2;
      A2[0] ^= _roundConstants["default"][i2];
      A2[1] ^= _roundConstants["default"][i2 + 1];
    };
    var _default = iota;
    exports["default"] = _default;
  }
});

// node_modules/sha3/sponge/permute/rho-pi/pi-shuffles/index.js
var require_pi_shuffles = __commonJS({
  "node_modules/sha3/sponge/permute/rho-pi/pi-shuffles/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = void 0;
    var PI_SHUFFLES = [10, 7, 11, 17, 18, 3, 5, 16, 8, 21, 24, 4, 15, 23, 19, 13, 12, 2, 20, 14, 22, 9, 6, 1];
    var _default = PI_SHUFFLES;
    exports["default"] = _default;
  }
});

// node_modules/sha3/sponge/permute/rho-pi/rho-offsets/index.js
var require_rho_offsets = __commonJS({
  "node_modules/sha3/sponge/permute/rho-pi/rho-offsets/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = void 0;
    var RHO_OFFSETS = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 2, 14, 27, 41, 56, 8, 25, 43, 62, 18, 39, 61, 20, 44];
    var _default = RHO_OFFSETS;
    exports["default"] = _default;
  }
});

// node_modules/sha3/sponge/permute/rho-pi/index.js
var require_rho_pi = __commonJS({
  "node_modules/sha3/sponge/permute/rho-pi/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = void 0;
    var _piShuffles = _interopRequireDefault(require_pi_shuffles());
    var _rhoOffsets = _interopRequireDefault(require_rho_offsets());
    var _copy = _interopRequireDefault(require_copy());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var rhoPi = function rhoPi2(_ref) {
      var A2 = _ref.A, C = _ref.C, W = _ref.W;
      (0, _copy["default"])(A2, 1)(W, 0);
      var H = 0;
      var L = 0;
      var Wi = 0;
      var ri = 32;
      for (var i2 = 0; i2 < 24; i2++) {
        var j = _piShuffles["default"][i2];
        var r2 = _rhoOffsets["default"][i2];
        (0, _copy["default"])(A2, j)(C, 0);
        H = W[0];
        L = W[1];
        ri = 32 - r2;
        Wi = r2 < 32 ? 0 : 1;
        W[Wi] = H << r2 | L >>> ri;
        W[(Wi + 1) % 2] = L << r2 | H >>> ri;
        (0, _copy["default"])(W, 0)(A2, j);
        (0, _copy["default"])(C, 0)(W, 0);
      }
    };
    var _default = rhoPi;
    exports["default"] = _default;
  }
});

// node_modules/sha3/sponge/permute/theta/index.js
var require_theta = __commonJS({
  "node_modules/sha3/sponge/permute/theta/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = void 0;
    var _copy = _interopRequireDefault(require_copy());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var theta = function theta2(_ref) {
      var A2 = _ref.A, C = _ref.C, D = _ref.D, W = _ref.W;
      var H = 0;
      var L = 0;
      for (var x2 = 0; x2 < 5; x2++) {
        var x20 = x2 * 2;
        var x21 = (x2 + 5) * 2;
        var x22 = (x2 + 10) * 2;
        var x23 = (x2 + 15) * 2;
        var x24 = (x2 + 20) * 2;
        C[x20] = A2[x20] ^ A2[x21] ^ A2[x22] ^ A2[x23] ^ A2[x24];
        C[x20 + 1] = A2[x20 + 1] ^ A2[x21 + 1] ^ A2[x22 + 1] ^ A2[x23 + 1] ^ A2[x24 + 1];
      }
      for (var _x = 0; _x < 5; _x++) {
        (0, _copy["default"])(C, (_x + 1) % 5)(W, 0);
        H = W[0];
        L = W[1];
        W[0] = H << 1 | L >>> 31;
        W[1] = L << 1 | H >>> 31;
        D[_x * 2] = C[(_x + 4) % 5 * 2] ^ W[0];
        D[_x * 2 + 1] = C[(_x + 4) % 5 * 2 + 1] ^ W[1];
        for (var y = 0; y < 25; y += 5) {
          A2[(y + _x) * 2] ^= D[_x * 2];
          A2[(y + _x) * 2 + 1] ^= D[_x * 2 + 1];
        }
      }
    };
    var _default = theta;
    exports["default"] = _default;
  }
});

// node_modules/sha3/sponge/permute/index.js
var require_permute = __commonJS({
  "node_modules/sha3/sponge/permute/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = void 0;
    var _chi = _interopRequireDefault(require_chi());
    var _iota = _interopRequireDefault(require_iota());
    var _rhoPi = _interopRequireDefault(require_rho_pi());
    var _theta = _interopRequireDefault(require_theta());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var permute = function permute2() {
      var C = new Uint32Array(10);
      var D = new Uint32Array(10);
      var W = new Uint32Array(2);
      return function(A2) {
        for (var roundIndex = 0; roundIndex < 24; roundIndex++) {
          (0, _theta["default"])({ A: A2, C, D, W });
          (0, _rhoPi["default"])({ A: A2, C, W });
          (0, _chi["default"])({ A: A2, C });
          (0, _iota["default"])({ A: A2, roundIndex });
        }
        C.fill(0);
        D.fill(0);
        W.fill(0);
      };
    };
    var _default = permute;
    exports["default"] = _default;
  }
});

// node_modules/sha3/sponge/index.js
var require_sponge = __commonJS({
  "node_modules/sha3/sponge/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = void 0;
    var _buffer = require("buffer");
    var _permute = _interopRequireDefault(require_permute());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var xorWords = function xorWords2(I, O) {
      for (var i2 = 0; i2 < I.length; i2 += 8) {
        var o = i2 / 4;
        O[o] ^= I[i2 + 7] << 24 | I[i2 + 6] << 16 | I[i2 + 5] << 8 | I[i2 + 4];
        O[o + 1] ^= I[i2 + 3] << 24 | I[i2 + 2] << 16 | I[i2 + 1] << 8 | I[i2];
      }
      return O;
    };
    var readWords = function readWords2(I, O) {
      for (var o = 0; o < O.length; o += 8) {
        var i2 = o / 4;
        O[o] = I[i2 + 1];
        O[o + 1] = I[i2 + 1] >>> 8;
        O[o + 2] = I[i2 + 1] >>> 16;
        O[o + 3] = I[i2 + 1] >>> 24;
        O[o + 4] = I[i2];
        O[o + 5] = I[i2] >>> 8;
        O[o + 6] = I[i2] >>> 16;
        O[o + 7] = I[i2] >>> 24;
      }
      return O;
    };
    var Sponge = function Sponge2(_ref) {
      var _this = this;
      var capacity = _ref.capacity, padding = _ref.padding;
      var keccak = (0, _permute["default"])();
      var stateSize = 200;
      var blockSize = capacity / 8;
      var queueSize = stateSize - capacity / 4;
      var queueOffset = 0;
      var state = new Uint32Array(stateSize / 4);
      var queue = _buffer.Buffer.allocUnsafe(queueSize);
      this.absorb = function(buffer) {
        for (var i2 = 0; i2 < buffer.length; i2++) {
          queue[queueOffset] = buffer[i2];
          queueOffset += 1;
          if (queueOffset >= queueSize) {
            xorWords(queue, state);
            keccak(state);
            queueOffset = 0;
          }
        }
        return _this;
      };
      this.squeeze = function() {
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var output = { buffer: options.buffer || _buffer.Buffer.allocUnsafe(blockSize), padding: options.padding || padding, queue: _buffer.Buffer.allocUnsafe(queue.length), state: new Uint32Array(state.length) };
        queue.copy(output.queue);
        for (var i2 = 0; i2 < state.length; i2++) {
          output.state[i2] = state[i2];
        }
        output.queue.fill(0, queueOffset);
        output.queue[queueOffset] |= output.padding;
        output.queue[queueSize - 1] |= 128;
        xorWords(output.queue, output.state);
        for (var offset = 0; offset < output.buffer.length; offset += queueSize) {
          keccak(output.state);
          readWords(output.state, output.buffer.slice(offset, offset + queueSize));
        }
        return output.buffer;
      };
      this.reset = function() {
        queue.fill(0);
        state.fill(0);
        queueOffset = 0;
        return _this;
      };
      return this;
    };
    var _default = Sponge;
    exports["default"] = _default;
  }
});

// node_modules/sha3/index.js
var require_sha3 = __commonJS({
  "node_modules/sha3/index.js"(exports) {
    "use strict";
    init_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports["default"] = exports.SHAKE = exports.SHA3Hash = exports.SHA3 = exports.Keccak = void 0;
    var _buffer = require("buffer");
    var _sponge = _interopRequireDefault(require_sponge());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var createHash = function createHash2(_ref) {
      var allowedSizes = _ref.allowedSizes, defaultSize = _ref.defaultSize, padding = _ref.padding;
      return function Hash() {
        var _this = this;
        var size = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : defaultSize;
        if (!this || this.constructor !== Hash) {
          return new Hash(size);
        }
        if (allowedSizes && !allowedSizes.includes(size)) {
          throw new Error("Unsupported hash length");
        }
        var sponge = new _sponge["default"]({ capacity: size });
        this.update = function(input) {
          var encoding = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "utf8";
          if (_buffer.Buffer.isBuffer(input)) {
            sponge.absorb(input);
            return _this;
          }
          if (typeof input === "string") {
            return _this.update(_buffer.Buffer.from(input, encoding));
          }
          throw new TypeError("Not a string or buffer");
        };
        this.digest = function() {
          var formatOrOptions = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "binary";
          var options = typeof formatOrOptions === "string" ? { format: formatOrOptions } : formatOrOptions;
          var buffer = sponge.squeeze({ buffer: options.buffer, padding: options.padding || padding });
          if (options.format && options.format !== "binary") {
            return buffer.toString(options.format);
          }
          return buffer;
        };
        this.reset = function() {
          sponge.reset();
          return _this;
        };
        return this;
      };
    };
    var Keccak = createHash({ allowedSizes: [224, 256, 384, 512], defaultSize: 512, padding: 1 });
    exports.Keccak = Keccak;
    var SHA3 = createHash({ allowedSizes: [224, 256, 384, 512], defaultSize: 512, padding: 6 });
    exports.SHA3 = SHA3;
    var SHAKE = createHash({ allowedSizes: [128, 256], defaultSize: 256, padding: 31 });
    exports.SHAKE = SHAKE;
    var SHA3Hash = Keccak;
    exports.SHA3Hash = SHA3Hash;
    SHA3.SHA3Hash = SHA3Hash;
    var _default = SHA3;
    exports["default"] = _default;
  }
});

// node_modules/@onflow/util-template/dist/template.js
var require_template = __commonJS({
  "node_modules/@onflow/util-template/dist/template.js"(exports) {
    init_shims();
    function interleave(a, b, c) {
      if (a === void 0) {
        a = [];
      }
      if (b === void 0) {
        b = [];
      }
      if (c === void 0) {
        c = [];
      }
      if (!a.length && !b.length)
        return c;
      if (!a.length)
        return c;
      if (!b.length)
        return [].concat(c, [a[0]]);
      var _a = a, aHead = _a[0], aRest = _a.slice(1);
      var _b = b, bHead = _b[0], bRest = _b.slice(1);
      if (aHead !== void 0)
        c.push(aHead);
      if (bHead !== void 0)
        c.push(bHead);
      return interleave(aRest, bRest, c);
    }
    function recApply(d) {
      return function(arg1) {
        if (typeof arg1 === "function") {
          console.warn("\n        %cFCL/SDK Deprecation Notice\n        ============================\n\n        Interopolation of functions into template literals will not be a thing in future versions of the Flow-JS-SDK or FCL.\n        You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params\n\n        ============================\n      ", "font-weight:bold;font-family:monospace;");
          return recApply(d)(arg1(d));
        }
        return String(arg1);
      };
    }
    function template2(head) {
      for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }
      if (typeof head === "string")
        return function() {
          return head;
        };
      if (Array.isArray(head)) {
        return function(d) {
          return interleave(head, rest.map(recApply(d))).join("").trim();
        };
      }
      return head;
    }
    exports.interleave = interleave;
    exports.template = template2;
  }
});

// node_modules/@onflow/sdk/dist/sdk.js
var require_sdk = __commonJS({
  "node_modules/@onflow/sdk/dist/sdk.js"(exports) {
    init_shims();
    require_util_logger();
    var utilInvariant = require_util_invariant();
    var config2 = require_config();
    var rlp = require_rlp();
    var transportHttp = require_sdk_send_http();
    var utilAddress = require_util_address();
    var sha3 = require_sha3();
    var utilTemplate = require_template();
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct)
        return false;
      if (Reflect.construct.sham)
        return false;
      if (typeof Proxy === "function")
        return true;
      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
      } catch (e2) {
        return false;
      }
    }
    function _construct(Parent, args2, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct2(Parent2, args3, Class2) {
          var a = [null];
          a.push.apply(a, args3);
          var Constructor = Function.bind.apply(Parent2, a);
          var instance = new Constructor();
          if (Class2)
            _setPrototypeOf(instance, Class2.prototype);
          return instance;
        };
      }
      return _construct.apply(null, arguments);
    }
    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
      _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
        if (Class2 === null || !_isNativeFunction(Class2))
          return Class2;
        if (typeof Class2 !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
          if (_cache.has(Class2))
            return _cache.get(Class2);
          _cache.set(Class2, Wrapper);
        }
        function Wrapper() {
          return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class2.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return _setPrototypeOf(Wrapper, Class2);
      };
      return _wrapNativeSuper(Class);
    }
    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null)
        return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key2, i2;
      for (i2 = 0; i2 < sourceKeys.length; i2++) {
        key2 = sourceKeys[i2];
        if (excluded.indexOf(key2) >= 0)
          continue;
        target[key2] = source[key2];
      }
      return target;
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++)
        arr2[i2] = arr[i2];
      return arr2;
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it)
        return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i2 = 0;
        return function() {
          if (i2 >= o.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o[i2++]
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var buildWarningMessage = function buildWarningMessage2(_ref) {
      var name = _ref.name, transitionsPath = _ref.transitionsPath;
      console.warn("\n    %cFCL/SDK Deprecation Notice\n    ============================\n    The " + name + " builder has been deprecated and will be removed in future versions of the Flow JS-SDK/FCL.\n    You can learn more (including a guide on common transition paths) here: " + transitionsPath + "\n    ============================\n  ", "font-weight:bold;font-family:monospace;");
    };
    var buildErrorMessage = function buildErrorMessage2(_ref2) {
      var name = _ref2.name, transitionsPath = _ref2.transitionsPath;
      console.error("\n    %cFCL/SDK Deprecation Notice\n    ============================\n    The " + name + " builder has been removed from the Flow JS-SDK/FCL.\n    You can learn more (including a guide on common transition paths) here: " + transitionsPath + "\n    ============================\n  ", "font-weight:bold;font-family:monospace;");
    };
    var warn = function warn2(deprecated) {
      return buildWarningMessage(deprecated);
    };
    var error2 = function error3(deprecated) {
      buildErrorMessage(deprecated);
    };
    var deprecate2 = {
      warn,
      error: error2
    };
    function _catch$2(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var UNKNOWN = "UNKNOWN";
    var SCRIPT = "SCRIPT";
    var TRANSACTION = "TRANSACTION";
    var GET_TRANSACTION_STATUS = "GET_TRANSACTION_STATUS";
    var GET_ACCOUNT = "GET_ACCOUNT";
    var GET_EVENTS = "GET_EVENTS";
    var PING = "PING";
    var GET_TRANSACTION = "GET_TRANSACTION";
    var GET_BLOCK = "GET_BLOCK";
    var GET_BLOCK_HEADER = "GET_BLOCK_HEADER";
    var GET_COLLECTION = "GET_COLLECTION";
    var BAD = "BAD";
    var OK = "OK";
    var ACCOUNT = "ACCOUNT";
    var PARAM = "PARAM";
    var ARGUMENT = "ARGUMENT";
    var AUTHORIZER = "authorizer";
    var PAYER = "payer";
    var PROPOSER = "proposer";
    var ACCT = '{\n  "kind":"' + ACCOUNT + '",\n  "tempId":null,\n  "addr":null,\n  "keyId":null,\n  "sequenceNum":null,\n  "signature":null,\n  "signingFunction":null,\n  "resolve":null,\n  "role": {\n    "proposer":false,\n    "authorizer":false,\n    "payer":false,\n    "param":false\n  }\n}';
    var ARG = '{\n  "kind":"' + ARGUMENT + '",\n  "tempId":null,\n  "value":null,\n  "asArgument":null,\n  "xform":null,\n  "resolve": null,\n  "resolveArgument": null\n}';
    var IX = '{\n  "tag":"' + UNKNOWN + '",\n  "assigns":{},\n  "status":"' + OK + '",\n  "reason":null,\n  "accounts":{},\n  "params":{},\n  "arguments":{},\n  "message": {\n    "cadence":null,\n    "refBlock":null,\n    "computeLimit":null,\n    "proposer":null,\n    "payer":null,\n    "authorizations":[],\n    "params":[],\n    "arguments":[]\n  },\n  "proposer":null,\n  "authorizations":[],\n  "payer":[],\n  "events": {\n    "eventType":null,\n    "start":null,\n    "end":null,\n    "blockIds":[]\n  },\n  "transaction": {\n    "id":null\n  },\n  "block": {\n    "id":null,\n    "height":null,\n    "isSealed":null\n  },\n  "account": {\n    "addr":null\n  },\n  "collection": {\n    "id":null\n  }\n}';
    var KEYS = new Set(Object.keys(JSON.parse(IX)));
    var interaction = function interaction2() {
      return JSON.parse(IX);
    };
    var CHARS = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
    var randChar = function randChar2() {
      return CHARS[~~(Math.random() * CHARS.length)];
    };
    var uuid = function uuid2() {
      return Array.from({
        length: 10
      }, randChar).join("");
    };
    var isNumber$1 = function isNumber2(d) {
      return typeof d === "number";
    };
    var isArray$1 = function isArray2(d) {
      return Array.isArray(d);
    };
    var isObj = function isObj2(d) {
      return d !== null && typeof d === "object";
    };
    var isNull = function isNull2(d) {
      return d == null;
    };
    var isFn$3 = function isFn2(d) {
      return typeof d === "function";
    };
    var isInteraction = function isInteraction2(ix) {
      if (!isObj(ix) || isNull(ix) || isNumber$1(ix))
        return false;
      for (var _iterator = _createForOfIteratorHelperLoose(KEYS), _step; !(_step = _iterator()).done; ) {
        var key2 = _step.value;
        if (!ix.hasOwnProperty(key2))
          return false;
      }
      return true;
    };
    var Ok = function Ok2(ix) {
      ix.status = OK;
      return ix;
    };
    var Bad = function Bad2(ix, reason) {
      ix.status = BAD;
      ix.reason = reason;
      return ix;
    };
    var makeIx = function makeIx2(wat) {
      return function(ix) {
        ix.tag = wat;
        return Ok(ix);
      };
    };
    var prepAccount = function prepAccount2(acct, opts) {
      if (opts === void 0) {
        opts = {};
      }
      return function(ix) {
        var _extends2;
        utilInvariant.invariant(typeof acct === "function" || typeof acct === "object", "prepAccount must be passed an authorization function or an account object");
        utilInvariant.invariant(opts.role != null, "Account must have a role");
        var ACCOUNT2 = JSON.parse(ACCT);
        var role = opts.role;
        var tempId = uuid();
        if (acct.authorization && isFn$3(acct.authorization))
          acct = {
            resolve: acct.authorization
          };
        if (!acct.authorization && isFn$3(acct))
          acct = {
            resolve: acct
          };
        ix.accounts[tempId] = _extends({}, ACCOUNT2, {
          tempId
        }, acct, {
          role: _extends({}, ACCOUNT2.role, typeof acct.role === "object" ? acct.role : {}, (_extends2 = {}, _extends2[role] = true, _extends2))
        });
        if (role === AUTHORIZER) {
          ix.authorizations.push(tempId);
        } else if (role === PAYER) {
          ix.payer.push(tempId);
        } else {
          ix[role] = tempId;
        }
        return ix;
      };
    };
    var makeArgument = function makeArgument2(arg2) {
      return function(ix) {
        var tempId = uuid();
        ix.message.arguments.push(tempId);
        ix.arguments[tempId] = JSON.parse(ARG);
        ix.arguments[tempId].tempId = tempId;
        ix.arguments[tempId].value = arg2.value;
        ix.arguments[tempId].asArgument = arg2.asArgument;
        ix.arguments[tempId].xform = arg2.xform;
        ix.arguments[tempId].resolve = arg2.resolve;
        ix.arguments[tempId].resolveArgument = isFn$3(arg2.resolveArgument) ? arg2.resolveArgument.bind(arg2) : arg2.resolveArgument;
        return Ok(ix);
      };
    };
    var makeUnknown = makeIx(UNKNOWN);
    var makeScript = makeIx(SCRIPT);
    var makeTransaction = makeIx(TRANSACTION);
    var makeGetTransactionStatus = makeIx(GET_TRANSACTION_STATUS);
    var makeGetTransaction = makeIx(GET_TRANSACTION);
    var makeGetAccount = makeIx(GET_ACCOUNT);
    var makeGetEvents = makeIx(GET_EVENTS);
    var makePing = makeIx(PING);
    var makeGetBlock = makeIx(GET_BLOCK);
    var makeGetBlockHeader = makeIx(GET_BLOCK_HEADER);
    var makeGetCollection = makeIx(GET_COLLECTION);
    var is = function is2(wat) {
      return function(ix) {
        return ix.tag === wat;
      };
    };
    var isUnknown = is(UNKNOWN);
    var isScript = is(SCRIPT);
    var isTransaction = is(TRANSACTION);
    var isGetTransactionStatus = is(GET_TRANSACTION_STATUS);
    var isGetTransaction = is(GET_TRANSACTION);
    var isGetAccount = is(GET_ACCOUNT);
    var isGetEvents = is(GET_EVENTS);
    var isPing = is(PING);
    var isGetBlock = is(GET_BLOCK);
    var isGetBlockHeader = is(GET_BLOCK_HEADER);
    var isGetCollection = is(GET_COLLECTION);
    var isOk = function isOk2(ix) {
      return ix.status === OK;
    };
    var isBad = function isBad2(ix) {
      return ix.status === BAD;
    };
    var why = function why2(ix) {
      return ix.reason;
    };
    var isAccount = function isAccount2(account2) {
      return account2.kind === ACCOUNT;
    };
    var isParam = function isParam2(param2) {
      return param2.kind === PARAM;
    };
    var isArgument = function isArgument2(argument) {
      return argument.kind === ARGUMENT;
    };
    var hardMode = function hardMode2(ix) {
      for (var _i = 0, _Object$keys = Object.keys(ix); _i < _Object$keys.length; _i++) {
        var key2 = _Object$keys[_i];
        if (!KEYS.has(key2))
          throw new Error('"' + key2 + '" is an invalid root level Interaction property.');
      }
      return ix;
    };
    var recPipe = function recPipe2(ix, fns) {
      if (fns === void 0) {
        fns = [];
      }
      try {
        return Promise.resolve(_catch$2(function() {
          return Promise.resolve(ix).then(function(_ix) {
            ix = hardMode(_ix);
            if (isBad(ix))
              throw new Error("Interaction Error: " + ix.reason);
            if (!fns.length)
              return ix;
            var _fns = fns, hd = _fns[0], rest = _fns.slice(1);
            return Promise.resolve(hd).then(function(cur) {
              if (isFn$3(cur))
                return recPipe2(cur(ix), rest);
              if (isNull(cur) || !cur)
                return recPipe2(ix, rest);
              if (isInteraction(cur))
                return recPipe2(cur, rest);
              throw new Error("Invalid Interaction Composition");
            });
          });
        }, function(e2) {
          throw e2;
        }));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var pipe = function pipe2() {
      var _slice$call = [].slice.call(arguments), arg1 = _slice$call[0], arg2 = _slice$call[1];
      if (isArray$1(arg1) && arg2 == null)
        return function(d) {
          return pipe2(d, arg1);
        };
      return recPipe(arg1, arg2);
    };
    var identity$1 = function identity2(v) {
      return v;
    };
    var get = function get2(ix, key2, fallback) {
      return ix.assigns[key2] == null ? fallback : ix.assigns[key2];
    };
    var put = function put2(key2, value) {
      return function(ix) {
        ix.assigns[key2] = value;
        return Ok(ix);
      };
    };
    var update = function update2(key2, fn) {
      if (fn === void 0) {
        fn = identity$1;
      }
      return function(ix) {
        ix.assigns[key2] = fn(ix.assigns[key2], ix);
        return Ok(ix);
      };
    };
    var destroy = function destroy2(key2) {
      return function(ix) {
        delete ix.assigns[key2];
        return Ok(ix);
      };
    };
    var ixModule = {
      __proto__: null,
      UNKNOWN,
      SCRIPT,
      TRANSACTION,
      GET_TRANSACTION_STATUS,
      GET_ACCOUNT,
      GET_EVENTS,
      PING,
      GET_TRANSACTION,
      GET_BLOCK,
      GET_BLOCK_HEADER,
      GET_COLLECTION,
      BAD,
      OK,
      ACCOUNT,
      PARAM,
      ARGUMENT,
      AUTHORIZER,
      PAYER,
      PROPOSER,
      interaction,
      uuid,
      isNumber: isNumber$1,
      isArray: isArray$1,
      isObj,
      isNull,
      isFn: isFn$3,
      isInteraction,
      Ok,
      Bad,
      prepAccount,
      makeArgument,
      makeUnknown,
      makeScript,
      makeTransaction,
      makeGetTransactionStatus,
      makeGetTransaction,
      makeGetAccount,
      makeGetEvents,
      makePing,
      makeGetBlock,
      makeGetBlockHeader,
      makeGetCollection,
      isUnknown,
      isScript,
      isTransaction,
      isGetTransactionStatus,
      isGetTransaction,
      isGetAccount,
      isGetEvents,
      isPing,
      isGetBlock,
      isGetBlockHeader,
      isGetCollection,
      isOk,
      isBad,
      why,
      isAccount,
      isParam,
      isArgument,
      pipe,
      get,
      put,
      update,
      destroy
    };
    function build(fns) {
      if (fns === void 0) {
        fns = [];
      }
      return pipe(interaction(), fns);
    }
    var DEFAULT_RESPONSE = '{\n    "tag":null,\n    "transaction":null,\n    "transactionStatus":null,\n    "transactionId":null,\n    "encodedData":null,\n    "events":null,\n    "account":null,\n    "block":null,\n    "blockHeader":null,\n    "latestBlock":null,\n    "collection":null\n}';
    var response = function response2() {
      return JSON.parse(DEFAULT_RESPONSE);
    };
    function getBlock(isSealed) {
      if (isSealed === void 0) {
        isSealed = null;
      }
      return pipe([makeGetBlock, function(ix) {
        ix.block.isSealed = isSealed;
        return Ok(ix);
      }]);
    }
    function getAccount(addr) {
      return pipe([makeGetAccount, function(ix) {
        ix.account.addr = utilAddress.sansPrefix(addr);
        return Ok(ix);
      }]);
    }
    var latestBlockDeprecationNotice = function latestBlockDeprecationNotice2() {
      console.error("\n          %c@onflow/decode Deprecation Notice\n          ========================\n\n          Operating upon data of the latestBlock field of the response object is deprecated and will no longer be recognized in future releases of @onflow/decode.\n          Find out more here: https://github.com/onflow/flow-js-sdk/blob/master/packages/decode/WARNINGS.md#0001-Deprecating-latestBlock-field\n\n          =======================\n        ".replace(/\n\s+/g, "\n").trim(), "font-weight:bold;font-family:monospace;");
    };
    var decodeImplicit = function decodeImplicit2(i2) {
      return Promise.resolve(i2);
    };
    var decodeVoid = function decodeVoid2() {
      return Promise.resolve(null);
    };
    var decodeType = function decodeType2(type) {
      try {
        return Promise.resolve(type.staticType);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var decodePath = function decodePath2(path) {
      try {
        return Promise.resolve({
          domain: path.domain,
          identifier: path.identifier
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var decodeCapability = function decodeCapability2(cap) {
      try {
        return Promise.resolve({
          path: cap.path,
          address: cap.address,
          borrowType: cap.borrowType
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var decodeOptional = function decodeOptional2(optional, decoders, stack) {
      return Promise.resolve(optional ? recurseDecode(optional, decoders, stack) : null);
    };
    var decodeReference = function decodeReference2(v) {
      try {
        return Promise.resolve({
          address: v.address,
          type: v.type
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var decodeArray = function decodeArray2(array2, decoders, stack) {
      try {
        return Promise.resolve(Promise.all(array2.map(function(v) {
          return new Promise(function(res) {
            try {
              return Promise.resolve(recurseDecode(v, decoders, [].concat(stack, [v.type]))).then(res);
            } catch (e2) {
              return Promise.reject(e2);
            }
          });
        })));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var decodeDictionary = function decodeDictionary2(dictionary, decoders, stack) {
      try {
        return Promise.resolve(dictionary.reduce(function(acc, v) {
          return Promise.resolve(acc).then(function(_acc) {
            acc = _acc;
            return Promise.resolve(recurseDecode(v.key, decoders, [].concat(stack, [v.key]))).then(function(_recurseDecode3) {
              return Promise.resolve(recurseDecode(v.value, decoders, [].concat(stack, [v.key]))).then(function(_recurseDecode4) {
                acc[_recurseDecode3] = _recurseDecode4;
                return acc;
              });
            });
          });
        }, Promise.resolve({})));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var decodeComposite = function decodeComposite2(composite, decoders, stack) {
      try {
        return Promise.resolve(composite.fields.reduce(function(acc, v) {
          return Promise.resolve(acc).then(function(_acc2) {
            acc = _acc2;
            return Promise.resolve(recurseDecode(v.value, decoders, [].concat(stack, [v.name]))).then(function(_recurseDecode5) {
              acc[v.name] = _recurseDecode5;
              return acc;
            });
          });
        }, Promise.resolve({}))).then(function(decoded) {
          var decoder = composite.id && decoderLookup(decoders, composite.id);
          return decoder ? Promise.resolve(decoder(decoded)) : decoded;
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var defaultDecoders = {
      UInt: decodeImplicit,
      Int: decodeImplicit,
      UInt8: decodeImplicit,
      Int8: decodeImplicit,
      UInt16: decodeImplicit,
      Int16: decodeImplicit,
      UInt32: decodeImplicit,
      Int32: decodeImplicit,
      UInt64: decodeImplicit,
      Int64: decodeImplicit,
      UInt128: decodeImplicit,
      Int128: decodeImplicit,
      UInt256: decodeImplicit,
      Int256: decodeImplicit,
      Word8: decodeImplicit,
      Word16: decodeImplicit,
      Word32: decodeImplicit,
      Word64: decodeImplicit,
      UFix64: decodeImplicit,
      Fix64: decodeImplicit,
      String: decodeImplicit,
      Character: decodeImplicit,
      Bool: decodeImplicit,
      Address: decodeImplicit,
      Void: decodeVoid,
      Optional: decodeOptional,
      Reference: decodeReference,
      Array: decodeArray,
      Dictionary: decodeDictionary,
      Event: decodeComposite,
      Resource: decodeComposite,
      Struct: decodeComposite,
      Enum: decodeComposite,
      Type: decodeType,
      Path: decodePath,
      Capability: decodeCapability
    };
    var decoderLookup = function decoderLookup2(decoders, lookup) {
      var found = Object.keys(decoders).find(function(decoder) {
        if (/^\/.*\/$/.test(decoder)) {
          var reg = new RegExp(decoder.substring(1, decoder.length - 1));
          return reg.test(lookup);
        }
        return decoder === lookup;
      });
      return lookup && found && decoders[found];
    };
    var recurseDecode = function recurseDecode2(decodeInstructions, decoders, stack) {
      try {
        var decoder = decoderLookup(decoders, decodeInstructions.type);
        if (!decoder)
          throw new Error("Undefined Decoder Error: " + decodeInstructions.type + "@" + stack.join("."));
        return Promise.resolve(decoder(decodeInstructions.value, decoders, stack));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var decode$1 = function decode3(decodeInstructions, customDecoders, stack) {
      if (customDecoders === void 0) {
        customDecoders = {};
      }
      if (stack === void 0) {
        stack = [];
      }
      var decoders = _extends({}, defaultDecoders, customDecoders);
      return Promise.resolve(recurseDecode(decodeInstructions, decoders, stack));
    };
    var decodeResponse = function decodeResponse2(response2, customDecoders) {
      if (customDecoders === void 0) {
        customDecoders = {};
      }
      try {
        var _exit2;
        var decoders = _extends({}, defaultDecoders, customDecoders);
        var _temp2 = function() {
          if (response2.encodedData) {
            return Promise.resolve(decode$1(response2.encodedData, decoders)).then(function(_await$decode) {
              _exit2 = 1;
              return _await$decode;
            });
          } else
            return function() {
              if (response2.transactionStatus) {
                return Promise.resolve(Promise.all(response2.transactionStatus.events.map(function decodeEvents(e2) {
                  try {
                    var _e$eventIndex2 = e2.eventIndex, _e$transactionIndex2 = e2.transactionIndex, _e$transactionId2 = e2.transactionId, _e$type2 = e2.type;
                    return Promise.resolve(decode$1(e2.payload, decoders)).then(function(_decode) {
                      return {
                        type: _e$type2,
                        transactionId: _e$transactionId2,
                        transactionIndex: _e$transactionIndex2,
                        eventIndex: _e$eventIndex2,
                        data: _decode
                      };
                    });
                  } catch (e3) {
                    return Promise.reject(e3);
                  }
                }))).then(function(_Promise$all2) {
                  var _response$transaction = _extends({}, response2.transactionStatus, {
                    events: _Promise$all2
                  });
                  _exit2 = 1;
                  return _response$transaction;
                });
              } else
                return function() {
                  if (response2.transaction) {
                    var _response$transaction4 = response2.transaction;
                    _exit2 = 1;
                    return _response$transaction4;
                  } else
                    return function() {
                      if (response2.events) {
                        return Promise.resolve(Promise.all(response2.events.map(function decodeEvents(e2) {
                          try {
                            var _e$eventIndex4 = e2.eventIndex, _e$transactionIndex4 = e2.transactionIndex, _e$transactionId4 = e2.transactionId, _e$type4 = e2.type, _e$blockTimestamp2 = e2.blockTimestamp, _e$blockHeight2 = e2.blockHeight, _e$blockId2 = e2.blockId;
                            return Promise.resolve(decode$1(e2.payload, decoders)).then(function(_decode2) {
                              return {
                                blockId: _e$blockId2,
                                blockHeight: _e$blockHeight2,
                                blockTimestamp: _e$blockTimestamp2,
                                type: _e$type4,
                                transactionId: _e$transactionId4,
                                transactionIndex: _e$transactionIndex4,
                                eventIndex: _e$eventIndex4,
                                data: _decode2
                              };
                            });
                          } catch (e3) {
                            return Promise.reject(e3);
                          }
                        }))).then(function(_await$Promise$all) {
                          _exit2 = 1;
                          return _await$Promise$all;
                        });
                      } else if (response2.account) {
                        var _response$account2 = response2.account;
                        _exit2 = 1;
                        return _response$account2;
                      } else if (response2.block) {
                        var _response$block2 = response2.block;
                        _exit2 = 1;
                        return _response$block2;
                      } else if (response2.blockHeader) {
                        var _response$blockHeader2 = response2.blockHeader;
                        _exit2 = 1;
                        return _response$blockHeader2;
                      } else if (response2.latestBlock) {
                        latestBlockDeprecationNotice();
                        var _response$latestBlock2 = response2.latestBlock;
                        _exit2 = 1;
                        return _response$latestBlock2;
                      } else if (response2.transactionId) {
                        var _response$transaction5 = response2.transactionId;
                        _exit2 = 1;
                        return _response$transaction5;
                      } else if (response2.collection) {
                        var _response$collection2 = response2.collection;
                        _exit2 = 1;
                        return _response$collection2;
                      }
                    }();
                }();
            }();
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function(_result) {
          return _exit2 ? _result : null;
        }) : _exit2 ? _temp2 : null);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var getRefId = function getRefId2(opts) {
      try {
        return Promise.resolve(config2.config().get("accessNode.api")).then(function(node) {
          return Promise.resolve(config2.config.first(["sdk.transport", "sdk.send"], transportHttp.send)).then(function(sendFn) {
            utilInvariant.invariant(sendFn, "Required value for sdk.transport is not defined in config. See: https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21");
            var ix;
            return Promise.resolve(pipe(interaction(), [getBlock()])).then(function(_pipe) {
              ix = _pipe;
              return Promise.resolve(sendFn(ix, {
                config: config2.config,
                response,
                Buffer: rlp.Buffer,
                ix: ixModule
              }, {
                node
              })).then(function(_sendFn) {
                ix = _sendFn;
                return Promise.resolve(decodeResponse(ix)).then(function(_decodeResponse) {
                  ix = _decodeResponse;
                  return ix.id;
                });
              });
            });
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function resolveRefBlockId(opts) {
      return function(ix) {
        try {
          if (!isTransaction(ix))
            return Promise.resolve(Ok(ix));
          if (ix.message.refBlock)
            return Promise.resolve(Ok(ix));
          return Promise.resolve(getRefId(opts)).then(function(_getRefId) {
            ix.message.refBlock = _getRefId;
            return Ok(ix);
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      };
    }
    var resolveCadence = function resolveCadence2(ix) {
      try {
        var _temp4 = function() {
          if (isTransaction(ix) || isScript(ix)) {
            var _temp5 = function _temp52() {
              utilInvariant.invariant(isString$1(cadence), "Cadence needs to be a string at this point.");
              return Promise.resolve(config2.config().where(/^0x/).then(function(d) {
                return Object.entries(d).reduce(function(cadence2, _ref) {
                  var key2 = _ref[0], value = _ref[1];
                  var regex = new RegExp("(\\b" + key2 + "\\b)", "g");
                  return cadence2.replace(regex, value);
                }, cadence);
              })).then(function(_config$where$then) {
                ix.message.cadence = _config$where$then;
              });
            };
            var cadence = get(ix, "ix.cadence");
            utilInvariant.invariant(isFn$2(cadence) || isString$1(cadence), "Cadence needs to be a function or a string.");
            var _temp6 = function() {
              if (isFn$2(cadence))
                return Promise.resolve(cadence({})).then(function(_cadence) {
                  cadence = _cadence;
                });
            }();
            return _temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6);
          }
        }();
        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function() {
          return ix;
        }) : ix);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var isFn$2 = function isFn2(v) {
      return typeof v === "function";
    };
    var isString$1 = function isString2(v) {
      return typeof v === "string";
    };
    var _iteratorSymbol$1 = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
    function _settle$1(pact, state, value) {
      if (!pact.s) {
        if (value instanceof _Pact$1) {
          if (value.s) {
            if (state & 1) {
              state = value.s;
            }
            value = value.v;
          } else {
            value.o = _settle$1.bind(null, pact, state);
            return;
          }
        }
        if (value && value.then) {
          value.then(_settle$1.bind(null, pact, state), _settle$1.bind(null, pact, 2));
          return;
        }
        pact.s = state;
        pact.v = value;
        var observer = pact.o;
        if (observer) {
          observer(pact);
        }
      }
    }
    var _Pact$1 = /* @__PURE__ */ function() {
      function _Pact2() {
      }
      _Pact2.prototype.then = function(onFulfilled, onRejected) {
        var result = new _Pact2();
        var state = this.s;
        if (state) {
          var callback = state & 1 ? onFulfilled : onRejected;
          if (callback) {
            try {
              _settle$1(result, 1, callback(this.v));
            } catch (e2) {
              _settle$1(result, 2, e2);
            }
            return result;
          } else {
            return this;
          }
        }
        this.o = function(_this) {
          try {
            var value = _this.v;
            if (_this.s & 1) {
              _settle$1(result, 1, onFulfilled ? onFulfilled(value) : value);
            } else if (onRejected) {
              _settle$1(result, 1, onRejected(value));
            } else {
              _settle$1(result, 2, value);
            }
          } catch (e2) {
            _settle$1(result, 2, e2);
          }
        };
        return result;
      };
      return _Pact2;
    }();
    function _isSettledPact$1(thenable) {
      return thenable instanceof _Pact$1 && thenable.s & 1;
    }
    function _forTo$1(array2, body, check) {
      var i2 = -1, pact, reject;
      function _cycle(result) {
        try {
          while (++i2 < array2.length && (!check || !check())) {
            result = body(i2);
            if (result && result.then) {
              if (_isSettledPact$1(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle$1.bind(null, pact = new _Pact$1(), 2)));
                return;
              }
            }
          }
          if (pact) {
            _settle$1(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e2) {
          _settle$1(pact || (pact = new _Pact$1()), 2, e2);
        }
      }
      _cycle();
      return pact;
    }
    function _forOf$1(target, body, check) {
      if (typeof target[_iteratorSymbol$1] === "function") {
        var _cycle = function _cycle2(result) {
          try {
            while (!(step = iterator.next()).done && (!check || !check())) {
              result = body(step.value);
              if (result && result.then) {
                if (_isSettledPact$1(result)) {
                  result = result.v;
                } else {
                  result.then(_cycle2, reject || (reject = _settle$1.bind(null, pact = new _Pact$1(), 2)));
                  return;
                }
              }
            }
            if (pact) {
              _settle$1(pact, 1, result);
            } else {
              pact = result;
            }
          } catch (e2) {
            _settle$1(pact || (pact = new _Pact$1()), 2, e2);
          }
        };
        var iterator = target[_iteratorSymbol$1](), step, pact, reject;
        _cycle();
        if (iterator["return"]) {
          var _fixup = function _fixup2(value) {
            try {
              if (!step.done) {
                iterator["return"]();
              }
            } catch (e2) {
            }
            return value;
          };
          if (pact && pact.then) {
            return pact.then(_fixup, function(e2) {
              throw _fixup(e2);
            });
          }
          _fixup();
        }
        return pact;
      }
      if (!("length" in target)) {
        throw new TypeError("Object is not iterable");
      }
      var values = [];
      for (var i2 = 0; i2 < target.length; i2++) {
        values.push(target[i2]);
      }
      return _forTo$1(values, function(i3) {
        return body(values[i3]);
      }, check);
    }
    var resolveArguments = function resolveArguments2(ix) {
      try {
        var _temp3 = function() {
          if (isTransaction(ix) || isScript(ix)) {
            var _temp4 = _forOf$1(Object.entries(ix.arguments), function(_ref) {
              var id = _ref[0], arg2 = _ref[1];
              return Promise.resolve(handleArgResolution(arg2)).then(function(res) {
                ix.arguments[id].asArgument = cast(res);
              });
            });
            if (_temp4 && _temp4.then)
              return _temp4.then(function() {
              });
          }
        }();
        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function() {
          return ix;
        }) : ix);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var handleArgResolution = function handleArgResolution2(arg2, depth) {
      if (depth === void 0) {
        depth = 3;
      }
      try {
        utilInvariant.invariant(depth > 0, "Argument Resolve Recursion Limit Exceeded for Arg: " + arg2.tempId);
        if (isFn$1(arg2.resolveArgument)) {
          return Promise.resolve(arg2.resolveArgument()).then(function(resolvedArg) {
            return handleArgResolution2(resolvedArg, depth - 1);
          });
        } else {
          return Promise.resolve(arg2);
        }
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var isFn$1 = function isFn2(v) {
      return typeof v === "function";
    };
    function cast(arg2) {
      utilInvariant.invariant(typeof arg2.xform != null, "No type specified for argument: " + arg2.value);
      if (isFn$1(arg2.xform))
        return arg2.xform(arg2.value);
      if (isFn$1(arg2.xform.asArgument))
        return arg2.xform.asArgument(arg2.value);
      utilInvariant.invariant(false, "Invalid Argument", arg2);
    }
    var encodeTransactionPayload = function encodeTransactionPayload2(tx) {
      return prependTransactionDomainTag(rlpEncode(preparePayload(tx)));
    };
    var encodeTransactionEnvelope = function encodeTransactionEnvelope2(tx) {
      return prependTransactionDomainTag(rlpEncode(prepareEnvelope(tx)));
    };
    var encodeTxIdFromVoucher = function encodeTxIdFromVoucher2(voucher) {
      return sha3_256(rlpEncode(prepareVoucher(voucher)));
    };
    var rightPaddedHexBuffer = function rightPaddedHexBuffer2(value, pad) {
      return rlp.Buffer.from(value.padEnd(pad * 2, 0), "hex");
    };
    var leftPaddedHexBuffer = function leftPaddedHexBuffer2(value, pad) {
      return rlp.Buffer.from(value.padStart(pad * 2, 0), "hex");
    };
    var TRANSACTION_DOMAIN_TAG = rightPaddedHexBuffer(rlp.Buffer.from("FLOW-V0.0-transaction").toString("hex"), 32).toString("hex");
    var prependTransactionDomainTag = function prependTransactionDomainTag2(tx) {
      return TRANSACTION_DOMAIN_TAG + tx;
    };
    var addressBuffer = function addressBuffer2(addr) {
      return leftPaddedHexBuffer(addr, 8);
    };
    var blockBuffer = function blockBuffer2(block2) {
      return leftPaddedHexBuffer(block2, 32);
    };
    var argumentToString = function argumentToString2(arg2) {
      return rlp.Buffer.from(JSON.stringify(arg2), "utf8");
    };
    var scriptBuffer = function scriptBuffer2(script2) {
      return rlp.Buffer.from(script2, "utf8");
    };
    var signatureBuffer = function signatureBuffer2(signature) {
      return rlp.Buffer.from(signature, "hex");
    };
    var rlpEncode = function rlpEncode2(v) {
      return rlp.encode(v).toString("hex");
    };
    var sha3_256 = function sha3_2562(msg) {
      var sha = new sha3.SHA3(256);
      sha.update(rlp.Buffer.from(msg, "hex"));
      return sha.digest().toString("hex");
    };
    var preparePayload = function preparePayload2(tx) {
      validatePayload(tx);
      return [scriptBuffer(tx.cadence), tx.arguments.map(argumentToString), blockBuffer(tx.refBlock), tx.computeLimit, addressBuffer(utilAddress.sansPrefix(tx.proposalKey.address)), tx.proposalKey.keyId, tx.proposalKey.sequenceNum, addressBuffer(utilAddress.sansPrefix(tx.payer)), tx.authorizers.map(function(authorizer) {
        return addressBuffer(utilAddress.sansPrefix(authorizer));
      })];
    };
    var prepareEnvelope = function prepareEnvelope2(tx) {
      validateEnvelope(tx);
      return [preparePayload(tx), preparePayloadSignatures(tx)];
    };
    var preparePayloadSignatures = function preparePayloadSignatures2(tx) {
      var signers = collectSigners(tx);
      return tx.payloadSigs.map(function(sig2) {
        return {
          signerIndex: signers.get(sig2.address),
          keyId: sig2.keyId,
          sig: sig2.sig
        };
      }).sort(function(a, b) {
        if (a.signerIndex > b.signerIndex)
          return 1;
        if (a.signerIndex < b.signerIndex)
          return -1;
        if (a.keyId > b.keyId)
          return 1;
        if (a.keyId < b.keyId)
          return -1;
      }).map(function(sig2) {
        return [sig2.signerIndex, sig2.keyId, signatureBuffer(sig2.sig)];
      });
    };
    var collectSigners = function collectSigners2(tx) {
      var signers = /* @__PURE__ */ new Map();
      var i2 = 0;
      var addSigner = function addSigner2(addr) {
        if (!signers.has(addr)) {
          signers.set(addr, i2);
          i2++;
        }
      };
      addSigner(tx.proposalKey.address);
      addSigner(tx.payer);
      tx.authorizers.forEach(addSigner);
      return signers;
    };
    var prepareVoucher = function prepareVoucher2(voucher) {
      validateVoucher(voucher);
      var signers = collectSigners(voucher);
      var prepareSigs = function prepareSigs2(sigs) {
        return sigs.map(function(_ref) {
          var address = _ref.address, keyId = _ref.keyId, sig2 = _ref.sig;
          return {
            signerIndex: signers.get(address),
            keyId,
            sig: sig2
          };
        }).sort(function(a, b) {
          if (a.signerIndex > b.signerIndex)
            return 1;
          if (a.signerIndex < b.signerIndex)
            return -1;
          if (a.keyId > b.keyId)
            return 1;
          if (a.keyId < b.keyId)
            return -1;
        }).map(function(sig2) {
          return [sig2.signerIndex, sig2.keyId, signatureBuffer(sig2.sig)];
        });
      };
      return [[scriptBuffer(voucher.cadence), voucher.arguments.map(argumentToString), blockBuffer(voucher.refBlock), voucher.computeLimit, addressBuffer(utilAddress.sansPrefix(voucher.proposalKey.address)), voucher.proposalKey.keyId, voucher.proposalKey.sequenceNum, addressBuffer(utilAddress.sansPrefix(voucher.payer)), voucher.authorizers.map(function(authorizer) {
        return addressBuffer(utilAddress.sansPrefix(authorizer));
      })], prepareSigs(voucher.payloadSigs), prepareSigs(voucher.envelopeSigs)];
    };
    var validatePayload = function validatePayload2(tx) {
      payloadFields.forEach(function(field) {
        return checkField(tx, field);
      });
      proposalKeyFields.forEach(function(field) {
        return checkField(tx.proposalKey, field, "proposalKey");
      });
    };
    var validateEnvelope = function validateEnvelope2(tx) {
      payloadSigsFields.forEach(function(field) {
        return checkField(tx, field);
      });
      tx.payloadSigs.forEach(function(sig2, index6) {
        payloadSigFields.forEach(function(field) {
          return checkField(sig2, field, "payloadSigs", index6);
        });
      });
    };
    var validateVoucher = function validateVoucher2(voucher) {
      payloadFields.forEach(function(field) {
        return checkField(voucher, field);
      });
      proposalKeyFields.forEach(function(field) {
        return checkField(voucher.proposalKey, field, "proposalKey");
      });
      payloadSigsFields.forEach(function(field) {
        return checkField(voucher, field);
      });
      voucher.payloadSigs.forEach(function(sig2, index6) {
        payloadSigFields.forEach(function(field) {
          return checkField(sig2, field, "payloadSigs", index6);
        });
      });
      envelopeSigsFields.forEach(function(field) {
        return checkField(voucher, field);
      });
      voucher.envelopeSigs.forEach(function(sig2, index6) {
        envelopeSigFields.forEach(function(field) {
          return checkField(sig2, field, "envelopeSigs", index6);
        });
      });
    };
    var isNumber = function isNumber2(v) {
      return typeof v === "number";
    };
    var isString = function isString2(v) {
      return typeof v === "string";
    };
    var isObject = function isObject2(v) {
      return v !== null && typeof v === "object";
    };
    var isArray = function isArray2(v) {
      return isObject(v) && v instanceof Array;
    };
    var payloadFields = [{
      name: "cadence",
      check: isString
    }, {
      name: "arguments",
      check: isArray
    }, {
      name: "refBlock",
      check: isString,
      defaultVal: "0"
    }, {
      name: "computeLimit",
      check: isNumber
    }, {
      name: "proposalKey",
      check: isObject
    }, {
      name: "payer",
      check: isString
    }, {
      name: "authorizers",
      check: isArray
    }];
    var proposalKeyFields = [{
      name: "address",
      check: isString
    }, {
      name: "keyId",
      check: isNumber
    }, {
      name: "sequenceNum",
      check: isNumber
    }];
    var payloadSigsFields = [{
      name: "payloadSigs",
      check: isArray
    }];
    var payloadSigFields = [{
      name: "address",
      check: isString
    }, {
      name: "keyId",
      check: isNumber
    }, {
      name: "sig",
      check: isString
    }];
    var envelopeSigsFields = [{
      name: "envelopeSigs",
      check: isArray
    }];
    var envelopeSigFields = [{
      name: "address",
      check: isString
    }, {
      name: "keyId",
      check: isNumber
    }, {
      name: "sig",
      check: isString
    }];
    var checkField = function checkField2(obj, field, base2, index6) {
      var name = field.name, check = field.check, defaultVal = field.defaultVal;
      if (obj[name] == null && defaultVal != null)
        obj[name] = defaultVal;
      if (obj[name] == null)
        throw missingFieldError(name, base2, index6);
      if (!check(obj[name]))
        throw invalidFieldError(name, base2, index6);
    };
    var printFieldName = function printFieldName2(field, base2, index6) {
      if (!!base2)
        return index6 == null ? base2 + "." + field : base2 + "." + index6 + "." + field;
      return field;
    };
    var missingFieldError = function missingFieldError2(field, base2, index6) {
      return new Error("Missing field " + printFieldName(field, base2, index6));
    };
    var invalidFieldError = function invalidFieldError2(field, base2, index6) {
      return new Error("Invalid field " + printFieldName(field, base2, index6));
    };
    function findInsideSigners(ix) {
      var inside = new Set(ix.authorizations);
      inside.add(ix.proposer);
      if (Array.isArray(ix.payer)) {
        ix.payer.forEach(function(p) {
          return inside["delete"](p);
        });
      } else {
        inside["delete"](ix.payer);
      }
      return Array.from(inside);
    }
    function findOutsideSigners(ix) {
      var outside = new Set(Array.isArray(ix.payer) ? ix.payer : [ix.payer]);
      return Array.from(outside);
    }
    var createSignableVoucher = function createSignableVoucher2(ix) {
      var buildAuthorizers = function buildAuthorizers2() {
        var authorizations2 = ix.authorizations.map(function(cid) {
          return utilAddress.withPrefix(ix.accounts[cid].addr);
        }).reduce(function(prev, current) {
          return prev.find(function(item) {
            return item === current;
          }) ? prev : [].concat(prev, [current]);
        }, []);
        return authorizations2[0] ? authorizations2 : [];
      };
      var buildInsideSigners = function buildInsideSigners2() {
        return findInsideSigners(ix).map(function(id) {
          return {
            address: utilAddress.withPrefix(ix.accounts[id].addr),
            keyId: ix.accounts[id].keyId,
            sig: ix.accounts[id].signature
          };
        });
      };
      var buildOutsideSigners = function buildOutsideSigners2() {
        return findOutsideSigners(ix).map(function(id) {
          return {
            address: utilAddress.withPrefix(ix.accounts[id].addr),
            keyId: ix.accounts[id].keyId,
            sig: ix.accounts[id].signature
          };
        });
      };
      return {
        cadence: ix.message.cadence,
        refBlock: ix.message.refBlock || null,
        computeLimit: ix.message.computeLimit,
        arguments: ix.message.arguments.map(function(id) {
          return ix.arguments[id].asArgument;
        }),
        proposalKey: {
          address: utilAddress.withPrefix(ix.accounts[ix.proposer].addr),
          keyId: ix.accounts[ix.proposer].keyId,
          sequenceNum: ix.accounts[ix.proposer].sequenceNum
        },
        payer: utilAddress.withPrefix(ix.accounts[Array.isArray(ix.payer) ? ix.payer[0] : ix.payer].addr),
        authorizers: buildAuthorizers(),
        payloadSigs: buildInsideSigners(),
        envelopeSigs: buildOutsideSigners()
      };
    };
    var voucherToTxId = function voucherToTxId2(voucher) {
      return encodeTxIdFromVoucher(voucher);
    };
    function _catch$1(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var _iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
    function _settle(pact, state, value) {
      if (!pact.s) {
        if (value instanceof _Pact) {
          if (value.s) {
            if (state & 1) {
              state = value.s;
            }
            value = value.v;
          } else {
            value.o = _settle.bind(null, pact, state);
            return;
          }
        }
        if (value && value.then) {
          value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
          return;
        }
        pact.s = state;
        pact.v = value;
        var observer = pact.o;
        if (observer) {
          observer(pact);
        }
      }
    }
    var _Pact = /* @__PURE__ */ function() {
      function _Pact2() {
      }
      _Pact2.prototype.then = function(onFulfilled, onRejected) {
        var result = new _Pact2();
        var state = this.s;
        if (state) {
          var callback = state & 1 ? onFulfilled : onRejected;
          if (callback) {
            try {
              _settle(result, 1, callback(this.v));
            } catch (e2) {
              _settle(result, 2, e2);
            }
            return result;
          } else {
            return this;
          }
        }
        this.o = function(_this) {
          try {
            var value = _this.v;
            if (_this.s & 1) {
              _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
            } else if (onRejected) {
              _settle(result, 1, onRejected(value));
            } else {
              _settle(result, 2, value);
            }
          } catch (e2) {
            _settle(result, 2, e2);
          }
        };
        return result;
      };
      return _Pact2;
    }();
    function _isSettledPact(thenable) {
      return thenable instanceof _Pact && thenable.s & 1;
    }
    function _forTo(array2, body, check) {
      var i2 = -1, pact, reject;
      function _cycle(result) {
        try {
          while (++i2 < array2.length && (!check || !check())) {
            result = body(i2);
            if (result && result.then) {
              if (_isSettledPact(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                return;
              }
            }
          }
          if (pact) {
            _settle(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e2) {
          _settle(pact || (pact = new _Pact()), 2, e2);
        }
      }
      _cycle();
      return pact;
    }
    function _forOf(target, body, check) {
      if (typeof target[_iteratorSymbol] === "function") {
        var _cycle = function _cycle2(result) {
          try {
            while (!(step = iterator.next()).done && (!check || !check())) {
              result = body(step.value);
              if (result && result.then) {
                if (_isSettledPact(result)) {
                  result = result.v;
                } else {
                  result.then(_cycle2, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                  return;
                }
              }
            }
            if (pact) {
              _settle(pact, 1, result);
            } else {
              pact = result;
            }
          } catch (e2) {
            _settle(pact || (pact = new _Pact()), 2, e2);
          }
        };
        var iterator = target[_iteratorSymbol](), step, pact, reject;
        _cycle();
        if (iterator["return"]) {
          var _fixup = function _fixup2(value) {
            try {
              if (!step.done) {
                iterator["return"]();
              }
            } catch (e2) {
            }
            return value;
          };
          if (pact && pact.then) {
            return pact.then(_fixup, function(e2) {
              throw _fixup(e2);
            });
          }
          _fixup();
        }
        return pact;
      }
      if (!("length" in target)) {
        throw new TypeError("Object is not iterable");
      }
      var values = [];
      for (var i2 = 0; i2 < target.length; i2++) {
        values.push(target[i2]);
      }
      return _forTo(values, function(i3) {
        return body(values[i3]);
      }, check);
    }
    var resolveAccounts = function resolveAccounts2(ix) {
      try {
        var _exit2;
        var _temp2 = function() {
          if (isTransaction(ix)) {
            if (!Array.isArray(ix.payer)) {
              console.warn('\n        %cFCL Warning\n        ============================\n        "ix.payer" must be an array. Support for ix.payer as a singular is deprecated,\n        see changelog for more info.\n        ============================\n        ', "font-weight:bold;font-family:monospace;");
            }
            return _catch$1(function() {
              return Promise.resolve(collectAccounts(ix, Object.values(ix.accounts))).then(function() {
                return Promise.resolve(collectAccounts(ix, Object.values(ix.accounts))).then(function() {
                });
              });
            }, function(error3) {
              console.error("=== SAD PANDA ===\n\n", error3, "\n\n=== SAD PANDA ===");
              throw error3;
            });
          }
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function(_result2) {
          return _exit2 ? _result2 : ix;
        }) : _exit2 ? _temp2 : ix);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var collectAccounts = function collectAccounts2(ix, accounts, last, depth) {
      if (depth === void 0) {
        depth = 3;
      }
      try {
        var _temp9 = function _temp92(_result4) {
          if (_exit5)
            return _result4;
          if (last) {
            ix.authorizations = ix.authorizations.map(function(d) {
              return d === last.tempId ? authorizations2 : d;
            }).reduce(function(prev, curr) {
              return Array.isArray(curr) ? [].concat(prev, curr) : [].concat(prev, [curr]);
            }, []);
          }
        };
        var _exit5;
        utilInvariant.invariant(depth, "Account Resolve Recursion Limit Exceeded", {
          ix,
          accounts
        });
        var authorizations2 = [];
        var _temp10 = _forOf(accounts, function(ax) {
          function _temp6() {
            var _exit4;
            function _temp4(_result3) {
              if (_exit4)
                ;
              if (old.tempId != ax.tempId)
                delete ix.accounts[old.tempId];
            }
            var _temp3 = function() {
              if (Array.isArray(ax)) {
                return Promise.resolve(collectAccounts2(ix, ax, old, depth - 1)).then(function() {
                });
              } else {
                if (ax.addr != null && ax.keyId != null) {
                  ax.tempId = ax.addr + "-" + ax.keyId;
                }
                ix.accounts[ax.tempId] = ix.accounts[ax.tempId] || ax;
                ix.accounts[ax.tempId].role.proposer = ix.accounts[ax.tempId].role.proposer || ax.role.proposer;
                ix.accounts[ax.tempId].role.payer = ix.accounts[ax.tempId].role.payer || ax.role.payer;
                ix.accounts[ax.tempId].role.authorizer = ix.accounts[ax.tempId].role.authorizer || ax.role.authorizer;
                if (ix.accounts[ax.tempId].role.proposer && ix.proposer === old.tempId) {
                  ix.proposer = ax.tempId;
                }
                if (ix.accounts[ax.tempId].role.payer) {
                  if (Array.isArray(ix.payer)) {
                    ix.payer = Array.from(new Set([].concat(ix.payer, [ax.tempId]).map(function(d) {
                      return d === old.tempId ? ax.tempId : d;
                    })));
                  } else {
                    ix.payer = Array.from(new Set([ix.payer, ax.tempId].map(function(d) {
                      return d === old.tempId ? ax.tempId : d;
                    })));
                  }
                  if (ix.payer.length > 1) {
                    var dupList = [];
                    var payerAccts = [];
                    ix.payer = ix.payer.reduce(function(g, tempId) {
                      var _ix$accounts$tempId = ix.accounts[tempId], addr = _ix$accounts$tempId.addr, keyId = _ix$accounts$tempId.keyId;
                      var key2 = addr + "-" + keyId;
                      payerAccts.push(addr);
                      if (dupList.includes(key2))
                        return g;
                      dupList.push(key2);
                      return [].concat(g, [tempId]);
                    }, []);
                    var multiAccts = Array.from(new Set(payerAccts));
                    if (multiAccts.length > 1) {
                      throw new Error("Payer can not be different accounts");
                    }
                  }
                }
                if (ix.accounts[ax.tempId].role.authorizer) {
                  if (last) {
                    authorizations2 = Array.from(new Set([].concat(authorizations2, [ax.tempId])));
                  } else {
                    ix.authorizations = ix.authorizations.map(function(d) {
                      return d === old.tempId ? ax.tempId : d;
                    });
                  }
                }
              }
            }();
            return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
          }
          var old = last || ax;
          var _temp5 = function() {
            if (isFn(ax.resolve))
              return Promise.resolve(ax.resolve(ax, buildPreSignable(ax, ix))).then(function(_ax$resolve) {
                ax = _ax$resolve;
              });
          }();
          return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
        }, function() {
          return _exit5;
        });
        return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(_temp9) : _temp9(_temp10));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var isFn = function isFn2(v) {
      return typeof v === "function";
    };
    function buildPreSignable(acct, ix) {
      try {
        return {
          f_type: "PreSignable",
          f_vsn: "1.0.1",
          roles: acct.role,
          cadence: ix.message.cadence,
          args: ix.message.arguments.map(function(d) {
            return ix.arguments[d].asArgument;
          }),
          data: {},
          interaction: ix,
          voucher: createSignableVoucher(ix)
        };
      } catch (error3) {
        console.error("buildPreSignable", error3);
        throw error3;
      }
    }
    function _catch(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var resolveSignatures = function resolveSignatures2(ix) {
      try {
        var _exit2;
        var _temp2 = function() {
          if (isTransaction(ix)) {
            return _catch(function() {
              var insideSigners = findInsideSigners(ix);
              var insidePayload = encodeTransactionPayload(prepForEncoding(ix));
              return Promise.resolve(Promise.all(insideSigners.map(fetchSignature(ix, insidePayload)))).then(function() {
                var outsideSigners = findOutsideSigners(ix);
                var outsidePayload = encodeTransactionEnvelope(_extends({}, prepForEncoding(ix), {
                  payloadSigs: insideSigners.map(function(id) {
                    return {
                      address: ix.accounts[id].addr,
                      keyId: ix.accounts[id].keyId,
                      sig: ix.accounts[id].signature
                    };
                  })
                }));
                return Promise.resolve(Promise.all(outsideSigners.map(fetchSignature(ix, outsidePayload)))).then(function() {
                });
              });
            }, function(error3) {
              console.error("Signatures", error3, {
                ix
              });
              throw error3;
            });
          }
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function(_result2) {
          return _exit2 ? _result2 : ix;
        }) : _exit2 ? _temp2 : ix);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function fetchSignature(ix, payload) {
      return function innerFetchSignature(id) {
        try {
          var acct = ix.accounts[id];
          if (acct.signature != null)
            return Promise.resolve();
          return Promise.resolve(acct.signingFunction(buildSignable(acct, payload, ix))).then(function(_ref) {
            var signature = _ref.signature;
            ix.accounts[id].signature = signature;
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      };
    }
    function buildSignable(acct, message, ix) {
      try {
        return {
          f_type: "Signable",
          f_vsn: "1.0.1",
          message,
          addr: utilAddress.sansPrefix(acct.addr),
          keyId: acct.keyId,
          roles: acct.role,
          cadence: ix.message.cadence,
          args: ix.message.arguments.map(function(d) {
            return ix.arguments[d].asArgument;
          }),
          data: {},
          interaction: ix,
          voucher: createSignableVoucher(ix)
        };
      } catch (error3) {
        console.error("buildSignable", error3);
        throw error3;
      }
    }
    function prepForEncoding(ix) {
      var payerAddress = utilAddress.sansPrefix((Array.isArray(ix.payer) ? ix.accounts[ix.payer[0]] : ix.accounts[ix.payer]).addr);
      return {
        cadence: ix.message.cadence,
        refBlock: ix.message.refBlock || null,
        computeLimit: ix.message.computeLimit,
        arguments: ix.message.arguments.map(function(id) {
          return ix.arguments[id].asArgument;
        }),
        proposalKey: {
          address: utilAddress.sansPrefix(ix.accounts[ix.proposer].addr),
          keyId: ix.accounts[ix.proposer].keyId,
          sequenceNum: ix.accounts[ix.proposer].sequenceNum
        },
        payer: payerAddress,
        authorizers: ix.authorizations.map(function(cid) {
          return utilAddress.sansPrefix(ix.accounts[cid].addr);
        }).reduce(function(prev, current) {
          return prev.find(function(item) {
            return item === current;
          }) ? prev : [].concat(prev, [current]);
        }, [])
      };
    }
    var resolveValidators = function resolveValidators2(ix) {
      try {
        var validators = get(ix, "ix.validators", []);
        return Promise.resolve(pipe(ix, validators.map(function(cb) {
          return function(ix2) {
            return cb(ix2, {
              Ok,
              Bad
            });
          };
        })));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var resolveFinalNormalization = function resolveFinalNormalization2(ix) {
      try {
        for (var _i = 0, _Object$keys = Object.keys(ix.accounts); _i < _Object$keys.length; _i++) {
          var key2 = _Object$keys[_i];
          ix.accounts[key2].addr = utilAddress.sansPrefix(ix.accounts[key2].addr);
        }
        return Promise.resolve(ix);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var resolveVoucherIntercept = function resolveVoucherIntercept2(ix) {
      try {
        var fn = get(ix, "ix.voucher-intercept");
        var _temp2 = function() {
          if (isFn$3(fn)) {
            return Promise.resolve(fn(createSignableVoucher(ix))).then(function() {
            });
          }
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function() {
          return ix;
        }) : ix);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var execFetchSequenceNumber = function execFetchSequenceNumber2(ix) {
      try {
        var _temp6 = function() {
          if (isTransaction(ix)) {
            var acct = Object.values(ix.accounts).find(function(a) {
              return a.role.proposer;
            });
            utilInvariant.invariant(acct, "Transactions require a proposer");
            var _temp7 = function() {
              if (acct.sequenceNum == null) {
                return Promise.resolve(config2.config().get("accessNode.api")).then(function(node) {
                  return Promise.resolve(config2.config.first(["sdk.transport", "sdk.send"], transportHttp.send)).then(function(sendFn) {
                    utilInvariant.invariant(sendFn, "Required value for sdk.transport is not defined in config. See: https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21");
                    return Promise.resolve(build([getAccount(acct.addr)])).then(function(_build) {
                      return Promise.resolve(sendFn(_build, {
                        config: config2.config,
                        response,
                        Buffer: rlp.Buffer,
                        ix: ixModule
                      }, {
                        node
                      }).then(decodeResponse).then(function(acct2) {
                        return acct2.keys;
                      }).then(function(keys) {
                        return keys.find(function(key2) {
                          return key2.index === acct.keyId;
                        });
                      }).then(function(key2) {
                        return key2.sequenceNumber;
                      })).then(function(_sendFn$then$then$the) {
                        ix.accounts[acct.tempId].sequenceNum = _sendFn$then$then$the;
                      });
                    });
                  });
                });
              }
            }();
            if (_temp7 && _temp7.then)
              return _temp7.then(function() {
              });
          }
        }();
        return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function() {
          return ix;
        }) : ix);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var execFetchRef = function execFetchRef2(ix) {
      try {
        var _temp3 = function() {
          if (isTransaction(ix) && ix.message.refBlock == null) {
            return Promise.resolve(config2.config().get("accessNode.api")).then(function(node) {
              return Promise.resolve(config2.config.first(["sdk.transport", "sdk.send"], transportHttp.send)).then(function(sendFn) {
                utilInvariant.invariant(sendFn, "Required value for sdk.transport is not defined in config. See: https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21");
                return Promise.resolve(sendFn(build([getBlock()]), {
                  config: config2.config,
                  response,
                  Buffer: rlp.Buffer,
                  ix: ixModule
                }, {
                  node
                }).then(decodeResponse)).then(function(_sendFn$then) {
                  ix.message.refBlock = _sendFn$then.id;
                });
              });
            });
          }
        }();
        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function() {
          return ix;
        }) : ix);
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var noop4 = function noop5(v) {
      return v;
    };
    var debug = function debug2(key2, fn) {
      if (fn === void 0) {
        fn = noop4;
      }
      return function(ix) {
        try {
          var take = function take2(obj, keys) {
            if (keys === void 0) {
              keys = [];
            }
            if (typeof keys === "string")
              keys = keys.split(" ");
            keys.reduce(function(acc, key3) {
              var _extends2;
              return _extends({}, acc, (_extends2 = {}, _extends2[key3] = obj[key3], _extends2));
            }, {});
          };
          var accts = function accts2(ix2) {
            return ["\nAccounts:", {
              proposer: ix2.proposer,
              authorizations: ix2.authorizations,
              payer: ix2.payer
            }, "\n\nDetails:", ix2.accounts].filter(Boolean);
          };
          var log = function log2() {
            var _console;
            (_console = console).log.apply(_console, ["debug[" + key2 + "] ---\n"].concat([].slice.call(arguments), ["\n\n\n---"]));
          };
          return Promise.resolve(config2.config.get("debug." + key2)).then(function(_config$get) {
            var _temp = function() {
              if (_config$get)
                return Promise.resolve(fn(ix, log, accts)).then(function() {
                });
            }();
            return _temp && _temp.then ? _temp.then(function() {
              return ix;
            }) : ix;
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      };
    };
    var resolve2 = pipe([
      resolveCadence,
      debug("cadence", function(ix, log) {
        return log(ix.message.cadence);
      }),
      resolveArguments,
      debug("arguments", function(ix, log) {
        return log(ix.message.arguments, ix.message);
      }),
      resolveAccounts,
      debug("accounts", function(ix, log, accts) {
        return log.apply(void 0, accts(ix));
      }),
      execFetchRef,
      execFetchSequenceNumber,
      resolveSignatures,
      debug("signatures", function(ix, log, accts) {
        return log.apply(void 0, accts(ix));
      }),
      resolveFinalNormalization,
      resolveValidators,
      resolveVoucherIntercept,
      debug("resolved", function(ix, log) {
        return log(ix);
      })
    ]);
    function invariant() {
      var args2 = [].slice.call(arguments);
      if (args2.length > 1) {
        var _args = args2, predicate = _args[0], message = _args[1];
        return invariant(function(ix, _ref) {
          var Ok2 = _ref.Ok, Bad2 = _ref.Bad;
          return predicate ? Ok2(ix) : Bad2(ix, message);
        });
      }
      var _args2 = args2, fn = _args2[0];
      return function(ix) {
        return fn(ix, {
          Ok,
          Bad
        });
      };
    }
    var send = function send2(args2, opts) {
      if (args2 === void 0) {
        args2 = [];
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        return Promise.resolve(config2.config.first(["sdk.transport", "sdk.send"], opts.send || transportHttp.send)).then(function(sendFn) {
          invariant(sendFn, "Required value for sdk.transport is not defined in config. See: https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21");
          return Promise.resolve(config2.config.first(["sdk.resolve"], opts.resolve || resolve2)).then(function(resolveFn) {
            function _temp(_config$get) {
              opts.node = _config$get;
              if (Array.isArray(args2))
                args2 = pipe(interaction(), args2);
              return Promise.resolve(resolveFn(args2)).then(function(_resolveFn) {
                return sendFn(_resolveFn, {
                  config: config2.config,
                  response,
                  ix: ixModule,
                  Buffer: rlp.Buffer
                }, opts);
              });
            }
            var _opts$node = opts.node;
            return _opts$node ? _temp(_opts$node) : Promise.resolve(config2.config().get("accessNode.api")).then(_temp);
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var decode2 = function decode3(response2) {
      try {
        return Promise.resolve(config2.config().where(/^decoder\./)).then(function(decodersFromConfig) {
          var decoders = Object.entries(decodersFromConfig).map(function(_ref) {
            var pattern = _ref[0], xform = _ref[1];
            pattern = "/" + pattern.replace(/^decoder\./, "") + "$/";
            return [pattern, xform];
          });
          return decodeResponse(response2, Object.fromEntries(decoders));
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var findPayloadSigners = function findPayloadSigners2(voucher) {
      var payload = new Set(voucher.authorizers);
      payload.add(voucher.proposalKey.address);
      payload["delete"](voucher.payer);
      return Array.from(payload).map(utilAddress.withPrefix);
    };
    var findEnvelopeSigners = function findEnvelopeSigners2(voucher) {
      var envelope = /* @__PURE__ */ new Set([voucher.payer]);
      return Array.from(envelope).map(utilAddress.withPrefix);
    };
    var UnableToDetermineMessageEncodingTypeForSignerAddress = /* @__PURE__ */ function(_Error) {
      _inheritsLoose(UnableToDetermineMessageEncodingTypeForSignerAddress2, _Error);
      function UnableToDetermineMessageEncodingTypeForSignerAddress2(signerAddress) {
        var _this;
        var msg = ("\n        Encode Message From Signable Error: Unable to determine message encoding for signer addresss: " + signerAddress + ". \n        Please ensure the address: " + signerAddress + " is intended to sign the given transaction as specified by the transaction signable.\n      ").trim();
        _this = _Error.call(this, msg) || this;
        _this.name = "Unable To Determine Message Encoding For Signer Addresss";
        return _this;
      }
      return UnableToDetermineMessageEncodingTypeForSignerAddress2;
    }(/* @__PURE__ */ _wrapNativeSuper(Error));
    var encodeMessageFromSignable = function encodeMessageFromSignable2(signable, signerAddress) {
      var payloadSigners = findPayloadSigners(signable.voucher);
      var envelopeSigners = findEnvelopeSigners(signable.voucher);
      var isPayloadSigner = payloadSigners.includes(utilAddress.withPrefix(signerAddress));
      var isEnvelopeSigner = envelopeSigners.includes(utilAddress.withPrefix(signerAddress));
      if (!isPayloadSigner && !isEnvelopeSigner) {
        throw new UnableToDetermineMessageEncodingTypeForSignerAddress(signerAddress);
      }
      var message = {
        cadence: signable.voucher.cadence,
        refBlock: signable.voucher.refBlock,
        computeLimit: signable.voucher.computeLimit,
        arguments: signable.voucher.arguments,
        proposalKey: _extends({}, signable.voucher.proposalKey, {
          address: utilAddress.sansPrefix(signable.voucher.proposalKey.address)
        }),
        payer: utilAddress.sansPrefix(signable.voucher.payer),
        authorizers: signable.voucher.authorizers.map(utilAddress.sansPrefix),
        payloadSigs: signable.voucher.payloadSigs.map(function(ps) {
          return _extends({}, ps, {
            address: utilAddress.sansPrefix(ps.address)
          });
        })
      };
      return isPayloadSigner ? encodeTransactionPayload(message) : encodeTransactionEnvelope(message);
    };
    function validator(cb) {
      return update("ix.validators", function(validators) {
        return Array.isArray(validators) ? validators.push(cb) : [cb];
      });
    }
    function atBlockHeight(height) {
      return pipe([function(ix) {
        ix.block.height = height;
        return ix;
      }, validator(function(ix) {
        if (typeof ix.block.isSealed === "boolean")
          throw new Error("Unable to specify both block height and isSealed.");
        if (ix.block.id)
          throw new Error("Unable to specify both block height and block id.");
        return ix;
      })]);
    }
    function atBlockId(id) {
      return pipe([function(ix) {
        ix.block.id = id;
        return Ok(ix);
      }, validator(function(ix, _ref) {
        var Ok2 = _ref.Ok, Bad2 = _ref.Bad;
        if (isGetAccount(ix))
          return Bad2(ix, "Unable to specify a block id with a Get Account interaction.");
        if (typeof ix.block.isSealed === "boolean")
          return Bad2(ix, "Unable to specify both block id and isSealed.");
        if (ix.block.height)
          return Bad2(ix, "Unable to specify both block id and block height.");
        return Ok2(ix);
      })]);
    }
    function account(address, _temp, opts) {
      var _ref = _temp === void 0 ? {} : _temp, height = _ref.height, id = _ref.id;
      utilInvariant.invariant(!(id && height), 'Method: account -- Cannot pass "id" and "height" simultaneously');
      if (id)
        return send([getAccount(address), atBlockId(id)], opts).then(decodeResponse);
      if (height)
        return send([getAccount(address), atBlockHeight(height)], opts).then(decodeResponse);
      return send([getAccount(address)], opts).then(decodeResponse);
    }
    function block(_temp, opts) {
      var _ref = _temp === void 0 ? {} : _temp, _ref$sealed = _ref.sealed, sealed = _ref$sealed === void 0 ? false : _ref$sealed, id = _ref.id, height = _ref.height;
      if (opts === void 0) {
        opts = {};
      }
      utilInvariant.invariant(!(sealed && id || sealed && height), 'Method: block -- Cannot pass "sealed" with "id" or "height"');
      utilInvariant.invariant(!(id && height), 'Method: block -- Cannot pass "id" and "height" simultaneously');
      if (id)
        return send([getBlock(), atBlockId(id)], opts).then(decodeResponse);
      if (height)
        return send([getBlock(), atBlockHeight(height)], opts).then(decodeResponse);
      return send([getBlock(sealed)], opts).then(decodeResponse);
    }
    function authorizations(ax) {
      if (ax === void 0) {
        ax = [];
      }
      return pipe(ax.map(function(authz) {
        return prepAccount(authz, {
          role: AUTHORIZER
        });
      }));
    }
    function authorization(addr, signingFunction, keyId, sequenceNum) {
      return {
        addr,
        signingFunction,
        keyId,
        sequenceNum
      };
    }
    function getEvents(eventType, start, end) {
      if (typeof start !== "undefined" || typeof end !== "undefined") {
        console.warn("\n      %cFCL/SDK Deprecation Notice\n      ============================\n  \n      Passing a start and end into getEnvents has been deprecated and will not be supported in future versions of the Flow JS-SDK/FCL.\n      You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0005-deprecate-start-end-get-events-builder\n  \n      ============================\n    ", "font-weight:bold;font-family:monospace;");
      }
      return pipe([makeGetEvents, function(ix) {
        ix.events.eventType = eventType;
        ix.events.start = start;
        ix.events.end = end;
        return Ok(ix);
      }]);
    }
    function getEventsAtBlockHeightRange(eventType, start, end) {
      return pipe([makeGetEvents, function(ix) {
        ix.events.eventType = eventType;
        ix.events.start = start;
        ix.events.end = end;
        return Ok(ix);
      }]);
    }
    function getEventsAtBlockIds(eventType, blockIds) {
      if (blockIds === void 0) {
        blockIds = [];
      }
      return pipe([makeGetEvents, function(ix) {
        ix.events.eventType = eventType;
        ix.events.blockIds = blockIds;
        return Ok(ix);
      }]);
    }
    function getBlockHeader(isSealed) {
      if (isSealed === void 0) {
        isSealed = null;
      }
      return pipe([makeGetBlockHeader, function(ix) {
        ix.block.isSealed = isSealed;
        return Ok(ix);
      }]);
    }
    function getCollection(id) {
      if (id === void 0) {
        id = null;
      }
      return pipe([makeGetCollection, function(ix) {
        ix.collection.id = id;
        return ix;
      }]);
    }
    function getTransactionStatus(transactionId) {
      return pipe([makeGetTransactionStatus, function(ix) {
        ix.transaction.id = transactionId;
        return Ok(ix);
      }]);
    }
    function getTransaction(transactionId) {
      return pipe([makeGetTransaction, function(ix) {
        ix.transaction.id = transactionId;
        return Ok(ix);
      }]);
    }
    function limit(computeLimit) {
      return function(ix) {
        ix.message.computeLimit = computeLimit;
        return ix;
      };
    }
    function args(ax) {
      if (ax === void 0) {
        ax = [];
      }
      return pipe(ax.map(makeArgument));
    }
    function arg(value, xform) {
      return {
        value,
        xform
      };
    }
    var proposer = function proposer2(authz) {
      try {
        return Promise.resolve(prepAccount(authz, {
          role: PROPOSER
        }));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var payer = function payer2(authz) {
      try {
        return Promise.resolve(prepAccount(authz, {
          role: PAYER
        }));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function ping() {
      return makePing;
    }
    function ref(refBlock) {
      return pipe([function(ix) {
        ix.message.refBlock = refBlock;
        return Ok(ix);
      }]);
    }
    function script() {
      return pipe([makeScript, put("ix.cadence", utilTemplate.template.apply(void 0, [].slice.call(arguments)))]);
    }
    var DEFAULT_COMPUTE_LIMIT = 10;
    var DEFAULT_SCRIPT_ACCOUNTS = [];
    var DEFUALT_REF = null;
    function transaction() {
      return pipe([makeTransaction, put("ix.cadence", utilTemplate.template.apply(void 0, [].slice.call(arguments))), function(ix) {
        ix.message.computeLimit = ix.message.computeLimit || DEFAULT_COMPUTE_LIMIT;
        ix.message.refBlock = ix.message.refBlock || DEFUALT_REF;
        ix.authorizations = ix.authorizations || DEFAULT_SCRIPT_ACCOUNTS;
        return Ok(ix);
      }]);
    }
    function voucherIntercept(fn) {
      return put("ix.voucher-intercept", fn);
    }
    var resolveProposerSequenceNumber = function resolveProposerSequenceNumber2(_ref) {
      var node = _ref.node;
      return function(ix) {
        try {
          if (!isTransaction(ix))
            return Promise.resolve(Ok(ix));
          if (ix.accounts[ix.proposer].sequenceNum)
            return Promise.resolve(Ok(ix));
          return Promise.resolve(config2.config.first(["sdk.transport", "sdk.send"], transportHttp.send)).then(function(sendFn) {
            utilInvariant.invariant(sendFn, "Required value for sdk.transport is not defined in config. See: https://github.com/onflow/fcl-js/blob/master/packages/sdk/CHANGELOG.md#0057-alpha1----2022-01-21");
            return Promise.resolve(build([getAccount(ix.accounts[ix.proposer].addr)])).then(function(_build) {
              return Promise.resolve(sendFn(_build, {
                config: config2.config,
                response,
                Buffer: rlp.Buffer,
                ix: ixModule
              }, {
                node
              })).then(function(response2) {
                return Promise.resolve(decodeResponse(response2)).then(function(decoded) {
                  ix.accounts[ix.proposer].sequenceNum = decoded.keys[ix.accounts[ix.proposer].keyId].sequenceNumber;
                  return Ok(ix);
                });
              });
            });
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      };
    };
    function mockAccountResponse(ix, numberOfKeys) {
      if (numberOfKeys === void 0) {
        numberOfKeys = 5;
      }
      utilInvariant.invariant(ix.account, "mockAccountResponse(ix) -- ix.account is missing", ix);
      utilInvariant.invariant(ix.account.addr, "mockAccountResponse(ix) -- ix.account.addr is missing", ix);
      var address = ix.account.addr;
      return {
        account: {
          addr: address,
          keys: Array.from({
            length: numberOfKeys
          }, function(_, i2) {
            return {
              index: i2,
              sequenceNumber: 42
            };
          })
        }
      };
    }
    function mockGetBlockResponse(ix) {
      return {
        tag: "GET_BLOCK",
        block: {
          id: "32"
        }
      };
    }
    var identity = function identity2(v) {
      return v;
    };
    function mockSend(fallback) {
      if (fallback === void 0) {
        fallback = identity;
      }
      return function execSend(ix) {
        return Promise.resolve(ix).then(function(_ix) {
          ix = _ix;
          switch (true) {
            case isGetAccount(ix):
              return mockAccountResponse(ix);
            case isGetBlock(ix):
              return mockGetBlockResponse();
            default:
              return fallback(ix);
          }
        });
      };
    }
    var _excluded = ["tempId"];
    var idof = function idof2(acct) {
      return acct.addr + "-" + acct.keyId;
    };
    function sig(opts) {
      return ["SIGNATURE", opts.addr, opts.keyId].join(".");
    }
    function authzFn(opts) {
      if (opts === void 0) {
        opts = {};
      }
      return function(account2) {
        var acct = _extends({}, account2, opts, {
          signingFunction: opts.signingFunction || account2.signingFunction || fallbackSigningFunction
        });
        return acct;
        function fallbackSigningFunction(signable) {
          return {
            addr: acct.addr,
            keyId: acct.keyId,
            signature: sig(acct)
          };
        }
      };
    }
    function authzResolve(opts) {
      if (opts === void 0) {
        opts = {};
      }
      return function(account2) {
        var _opts = opts, tempId = _opts.tempId, rest = _objectWithoutPropertiesLoose(_opts, _excluded);
        return _extends({}, account2, {
          tempId: tempId || "WITH_RESOLVE",
          resolve: authzFn(rest)
        });
      };
    }
    var ROLE = {
      proposer: false,
      authorizer: false,
      payer: false
    };
    function authzResolveMany(opts) {
      if (opts === void 0) {
        opts = {};
      }
      return function(account2) {
        var tempId = opts.tempId || "AUTHZ_RESOLVE_MANY";
        return _extends({}, account2, {
          tempId,
          resolve: function resolve3() {
            return [opts.proposer && authzFn(opts.proposer)({
              role: _extends({}, ROLE, {
                proposer: true
              })
            })].concat(opts.authorizations.map(authzFn).map(function(d) {
              return d({
                role: _extends({}, ROLE, {
                  authorizer: true
                })
              });
            }), [opts.payer && authzFn(opts.payer)({
              role: _extends({}, ROLE, {
                payer: true
              })
            })]).filter(Boolean);
          }
        });
      };
    }
    var run2 = function run3(fns) {
      if (fns === void 0) {
        fns = [];
      }
      return build([ref("123")].concat(fns)).then(resolve2);
    };
    var index5 = {
      __proto__: null,
      mockSend,
      authzFn,
      authzResolve,
      authzResolveMany,
      sig,
      idof,
      run: run2
    };
    var VERSION = "1.0.1";
    var params = function params2(_params) {
      return deprecate2.error({
        name: "params",
        transitionsPath: "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params"
      });
    };
    var param = function param2(params2) {
      return deprecate2.warn({
        name: "param",
        transitionsPath: "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params"
      });
    };
    Object.defineProperty(exports, "config", {
      enumerable: true,
      get: function() {
        return config2.config;
      }
    });
    Object.defineProperty(exports, "cadence", {
      enumerable: true,
      get: function() {
        return utilTemplate.template;
      }
    });
    Object.defineProperty(exports, "cdc", {
      enumerable: true,
      get: function() {
        return utilTemplate.template;
      }
    });
    exports.TestUtils = index5;
    exports.VERSION = VERSION;
    exports.account = account;
    exports.arg = arg;
    exports.args = args;
    exports.atBlockHeight = atBlockHeight;
    exports.atBlockId = atBlockId;
    exports.authorization = authorization;
    exports.authorizations = authorizations;
    exports.block = block;
    exports.build = build;
    exports.createSignableVoucher = createSignableVoucher;
    exports.decode = decode2;
    exports.destroy = destroy;
    exports.encodeMessageFromSignable = encodeMessageFromSignable;
    exports.encodeTransactionEnvelope = encodeTransactionEnvelope;
    exports.encodeTransactionPayload = encodeTransactionPayload;
    exports.encodeTxIdFromVoucher = encodeTxIdFromVoucher;
    exports.get = get;
    exports.getAccount = getAccount;
    exports.getBlock = getBlock;
    exports.getBlockHeader = getBlockHeader;
    exports.getCollection = getCollection;
    exports.getEvents = getEvents;
    exports.getEventsAtBlockHeightRange = getEventsAtBlockHeightRange;
    exports.getEventsAtBlockIds = getEventsAtBlockIds;
    exports.getTransaction = getTransaction;
    exports.getTransactionStatus = getTransactionStatus;
    exports.interaction = interaction;
    exports.invariant = invariant;
    exports.isBad = isBad;
    exports.isGetAccount = isGetAccount;
    exports.isGetBlock = isGetBlock;
    exports.isGetBlockHeader = isGetBlockHeader;
    exports.isGetCollection = isGetCollection;
    exports.isGetEvents = isGetEvents;
    exports.isGetTransaction = isGetTransaction;
    exports.isGetTransactionStatus = isGetTransactionStatus;
    exports.isOk = isOk;
    exports.isPing = isPing;
    exports.isScript = isScript;
    exports.isTransaction = isTransaction;
    exports.isUnknown = isUnknown;
    exports.limit = limit;
    exports.param = param;
    exports.params = params;
    exports.payer = payer;
    exports.ping = ping;
    exports.pipe = pipe;
    exports.proposer = proposer;
    exports.put = put;
    exports.ref = ref;
    exports.resolve = resolve2;
    exports.resolveAccounts = resolveAccounts;
    exports.resolveArguments = resolveArguments;
    exports.resolveCadence = resolveCadence;
    exports.resolveFinalNormalization = resolveFinalNormalization;
    exports.resolveProposerSequenceNumber = resolveProposerSequenceNumber;
    exports.resolveRefBlockId = resolveRefBlockId;
    exports.resolveSignatures = resolveSignatures;
    exports.resolveValidators = resolveValidators;
    exports.resolveVoucherIntercept = resolveVoucherIntercept;
    exports.script = script;
    exports.send = send;
    exports.transaction = transaction;
    exports.update = update;
    exports.validator = validator;
    exports.voucherIntercept = voucherIntercept;
    exports.voucherToTxId = voucherToTxId;
    exports.why = why;
  }
});

// node_modules/@onflow/types/dist/types.js
var require_types = __commonJS({
  "node_modules/@onflow/types/dist/types.js"(exports) {
    init_shims();
    var type = function type2(label, asArgument, asInjection) {
      return {
        label,
        asArgument,
        asInjection
      };
    };
    var isArray = function isArray2(d) {
      return Array.isArray(d);
    };
    var isObj = function isObj2(d) {
      return typeof d === "object";
    };
    var isNull = function isNull2(d) {
      return d == null;
    };
    var isBoolean = function isBoolean2(d) {
      return typeof d === "boolean";
    };
    var isNumber = function isNumber2(d) {
      return typeof d === "number";
    };
    var isInteger = function isInteger2(d) {
      return Number.isInteger(d);
    };
    var isString = function isString2(d) {
      return typeof d === "string";
    };
    var throwTypeError = function throwTypeError2(msg) {
      throw new Error("Type Error: " + msg);
    };
    var numberValuesDeprecationNotice = function numberValuesDeprecationNotice2(type2) {
      console.error(("\n          %c@onflow/types Deprecation Notice\n          ========================\n\n          Passing in Number as value for " + type2 + " is deprecated and will cease to work in future releases of @onflow/types.\n          Going forward, use String as value for " + type2 + ". \n          Find out more here: https://github.com/onflow/flow-js-sdk/blob/master/packages/types/WARNINGS.md#0002-[U]Int*-and-Word*-as-Number\n\n          =======================\n        ").replace(/\n\s+/g, "\n").trim(), "font-weight:bold;font-family:monospace;");
    };
    var Identity = type("Identity", function(v) {
      return v;
    }, function(v) {
      return v;
    });
    var UInt = type("UInt", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("UInt");
        return {
          type: "UInt",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "UInt",
          value: v
        };
      }
      throwTypeError("Expected Positive Integer for type Unsigned Int");
    }, function(v) {
      return v;
    });
    var Int = type("Int", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Int");
        return {
          type: "Int",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Int",
          value: v
        };
      }
      throwTypeError("Expected Integer for type Int");
    }, function(v) {
      return v;
    });
    var UInt8 = type("UInt8", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("UInt8");
        return {
          type: "UInt8",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "UInt8",
          value: v
        };
      }
      throwTypeError("Expected integer for UInt8");
    }, function(v) {
      return v;
    });
    var Int8 = type("Int8", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Int8");
        return {
          type: "Int8",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Int8",
          value: v
        };
      }
      throwTypeError("Expected positive integer for Int8");
    }, function(v) {
      return v;
    });
    var UInt16 = type("UInt16", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("UInt16");
        return {
          type: "UInt16",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "UInt16",
          value: v
        };
      }
      throwTypeError("Expected integer for UInt16");
    }, function(v) {
      return v;
    });
    var Int16 = type("Int16", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Int16");
        return {
          type: "Int16",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Int16",
          value: v
        };
      }
      throwTypeError("Expected positive integer for Int16");
    }, function(v) {
      return v;
    });
    var UInt32 = type("UInt32", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("UInt32");
        return {
          type: "UInt32",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "UInt32",
          value: v
        };
      }
      throwTypeError("Expected integer for UInt32");
    }, function(v) {
      return v;
    });
    var Int32 = type("Int32", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Int32");
        return {
          type: "Int32",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Int32",
          value: v
        };
      }
      throwTypeError("Expected positive integer for Int32");
    }, function(v) {
      return v;
    });
    var UInt64 = type("UInt64", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("UInt64");
        return {
          type: "UInt64",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "UInt64",
          value: v
        };
      }
      throwTypeError("Expected integer for UInt64");
    }, function(v) {
      return v;
    });
    var Int64 = type("Int64", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Int64");
        return {
          type: "Int64",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Int64",
          value: v
        };
      }
      throwTypeError("Expected positive integer for Int64");
    }, function(v) {
      return v;
    });
    var UInt128 = type("UInt128", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("UInt128");
        return {
          type: "UInt128",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "UInt128",
          value: v
        };
      }
      throwTypeError("Expected integer for UInt128");
    }, function(v) {
      return v;
    });
    var Int128 = type("Int128", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Int128");
        return {
          type: "Int128",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Int128",
          value: v
        };
      }
      throwTypeError("Expected positive integer for Int128");
    }, function(v) {
      return v;
    });
    var UInt256 = type("UInt256", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("UInt256");
        return {
          type: "UInt256",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "UInt256",
          value: v
        };
      }
      throwTypeError("Expected integer for UInt256");
    }, function(v) {
      return v;
    });
    var Int256 = type("Int256", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Int256");
        return {
          type: "Int256",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Int256",
          value: v
        };
      }
      throwTypeError("Expected integer for Int256");
    }, function(v) {
      return v;
    });
    var Word8 = type("Word8", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Word8");
        return {
          type: "Word8",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Word8",
          value: v
        };
      }
      throwTypeError("Expected positive number for Word8");
    }, function(v) {
      return v;
    });
    var Word16 = type("Word16", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Word16");
        return {
          type: "Word16",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Word16",
          value: v
        };
      }
      throwTypeError("Expected positive number for Word16");
    }, function(v) {
      return v;
    });
    var Word32 = type("Word32", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Word32");
        return {
          type: "Word32",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Word32",
          value: v
        };
      }
      throwTypeError("Expected positive number for Word32");
    }, function(v) {
      return v;
    });
    var Word64 = type("Word64", function(v) {
      if (isNumber(v) && isInteger(v)) {
        numberValuesDeprecationNotice("Word64");
        return {
          type: "Word64",
          value: v.toString()
        };
      }
      if (isString(v)) {
        return {
          type: "Word64",
          value: v
        };
      }
      throwTypeError("Expected positive number for Word64");
    }, function(v) {
      return v;
    });
    var UFix64AndFix64NumberDeprecationNotice = function UFix64AndFix64NumberDeprecationNotice2() {
      console.error("\n          %c@onflow/types Deprecation Notice\n          ========================\n\n          Passing in Numbers as values for Fix64 and UFix64 types is deprecated and will cease to work in future releases of @onflow/types.\n          Find out more here: https://github.com/onflow/flow-js-sdk/blob/master/packages/types/WARNINGS.md#0001-[U]Fix64-as-Number\n\n          =======================\n        ".replace(/\n\s+/g, "\n").trim(), "font-weight:bold;font-family:monospace;");
    };
    var UFix64 = type("UFix64", function(v) {
      if (isString(v)) {
        var vParts = v.split(".");
        if (vParts.length !== 2) {
          throwTypeError("Expected one decimal but found " + vParts.length + " in the [U]Fix64 value. Find out more about [U]Fix64 types here: https://docs.onflow.org/cadence/json-cadence-spec/#fixed-point-numbers");
        }
        if (vParts[1].length == 0 || vParts[1].length > 8) {
          throwTypeError("Expected at least one digit, and at most 8 digits following the decimal of the [U]Fix64 value but found " + vParts[1].length + " digits. Find out more about [U]Fix64 types here: https://docs.onflow.org/cadence/json-cadence-spec/#fixed-point-numbers");
        }
        return {
          type: "UFix64",
          value: v
        };
      } else if (isNumber(v)) {
        UFix64AndFix64NumberDeprecationNotice();
        return {
          type: "UFix64",
          value: v.toString()
        };
      }
      throwTypeError("Expected String for UFix64");
    }, function(v) {
      return v;
    });
    var Fix64 = type("Fix64", function(v) {
      if (isString(v)) {
        var vParts = v.split(".");
        if (vParts.length !== 2) {
          throwTypeError("Expected one decimal but found " + vParts.length + " in the [U]Fix64 value. Find out more about [U]Fix64 types here: https://docs.onflow.org/cadence/json-cadence-spec/#fixed-point-numbers");
        }
        if (vParts[1].length == 0 || vParts[1].length > 8) {
          throwTypeError("Expected at least one digit, and at most 8 digits following the decimal of the [U]Fix64 value but found " + vParts[1].length + " digits. Find out more about [U]Fix64 types here: https://docs.onflow.org/cadence/json-cadence-spec/#fixed-point-numbers");
        }
        return {
          type: "Fix64",
          value: v
        };
      } else if (isNumber(v)) {
        UFix64AndFix64NumberDeprecationNotice();
        return {
          type: "Fix64",
          value: v.toString()
        };
      }
      throwTypeError("Expected String for Fix64");
    }, function(v) {
      return v;
    });
    var String2 = type("String", function(v) {
      if (isString(v))
        return {
          type: "String",
          value: v
        };
      throwTypeError("Expected String for type String");
    }, function(v) {
      return v;
    });
    var Character = type("Character", function(v) {
      if (isString(v))
        return {
          type: "Character",
          value: v
        };
      throwTypeError("Expected Character for type Character");
    }, function(v) {
      return v;
    });
    var Bool = type("Bool", function(v) {
      if (isBoolean(v))
        return {
          type: "Bool",
          value: v
        };
      throwTypeError("Expected Boolean for type Bool");
    }, function(v) {
      return v;
    });
    var Address = type("Address", function(v) {
      if (isString(v))
        return {
          type: "Address",
          value: v
        };
      throwTypeError("Expected Address for type Address");
    }, function(v) {
      return v;
    });
    var Void = type("Void", function(v) {
      if (!v || isNull(v))
        return {
          type: "Void"
        };
      throwTypeError("Expected Void for type Void");
    }, function(v) {
      return v;
    });
    var Optional = function Optional2(children) {
      return type("Optional", function(v) {
        return {
          type: "Optional",
          value: isNull(v) ? null : children.asArgument(v)
        };
      }, function(v) {
        return v;
      });
    };
    var Reference = type("Reference", function(v) {
      if (isObj(v))
        return {
          type: "Reference",
          value: v
        };
      throwTypeError("Expected Object for type Reference");
    }, function(v) {
      return v;
    });
    var _Array = function _Array2(children) {
      if (children === void 0) {
        children = [];
      }
      return type("Array", function(v) {
        return {
          type: "Array",
          value: isArray(children) ? children.map(function(c, i2) {
            return c.asArgument(v[i2]);
          }) : v.map(function(x2) {
            return children.asArgument(x2);
          })
        };
      }, function(v) {
        return v;
      });
    };
    var Dictionary = function Dictionary2(children) {
      if (children === void 0) {
        children = [];
      }
      return type("Dictionary", function(v) {
        if (isObj(v))
          return {
            type: "Dictionary",
            value: isArray(children) ? children.map(function(c, i2) {
              return {
                key: c.key.asArgument(v[i2].key),
                value: c.value.asArgument(v[i2].value)
              };
            }) : isArray(v) ? v.map(function(x2) {
              return {
                key: children.key.asArgument(x2.key),
                value: children.value.asArgument(x2.value)
              };
            }) : [{
              key: children.key.asArgument(v.key),
              value: children.value.asArgument(v.value)
            }]
          };
        throwTypeError("Expected Object for type Dictionary");
      }, function(v) {
        return v;
      });
    };
    var Event = function Event2(id, fields) {
      if (fields === void 0) {
        fields = [];
      }
      return type("Event", function(v) {
        if (isObj(v))
          return {
            type: "Event",
            value: {
              id,
              fields: isArray(fields) ? fields.map(function(c, i2) {
                return {
                  name: v.fields[i2].name,
                  value: c.value.asArgument(v.fields[i2].value)
                };
              }) : v.fields.map(function(x2) {
                return {
                  name: x2.name,
                  value: fields.value.asArgument(x2.value)
                };
              })
            }
          };
        throwTypeError("Expected Object for type Event");
      }, function(v) {
        return v;
      });
    };
    var Resource = function Resource2(id, fields) {
      if (fields === void 0) {
        fields = [];
      }
      return type("Resource", function(v) {
        if (isObj(v))
          return {
            type: "Resource",
            value: {
              id,
              fields: isArray(fields) ? fields.map(function(c, i2) {
                return {
                  name: v.fields[i2].name,
                  value: c.value.asArgument(v.fields[i2].value)
                };
              }) : v.fields.map(function(x2) {
                return {
                  name: x2.name,
                  value: fields.value.asArgument(x2.value)
                };
              })
            }
          };
        throwTypeError("Expected Object for type Resource");
      }, function(v) {
        return v;
      });
    };
    var Struct = function Struct2(id, fields) {
      if (fields === void 0) {
        fields = [];
      }
      return type("Struct", function(v) {
        if (isObj(v))
          return {
            type: "Struct",
            value: {
              id,
              fields: isArray(fields) ? fields.map(function(c, i2) {
                return {
                  name: v.fields[i2].name,
                  value: c.value.asArgument(v.fields[i2].value)
                };
              }) : v.fields.map(function(x2) {
                return {
                  name: x2.name,
                  value: fields.value.asArgument(x2.value)
                };
              })
            }
          };
        throwTypeError("Expected Object for type Struct");
      }, function(v) {
        return v;
      });
    };
    var Path = type("Path", function(v) {
      if (isObj(v)) {
        if (!isString(v.domain)) {
          throwTypeError("Expected a string for the Path domain but found " + v.domain + ". Find out more about the Path type here: https://docs.onflow.org/cadence/json-cadence-spec/#path");
        }
        if (!(v.domain === "storage" || v.domain === "private" || v.domain === "public")) {
          throwTypeError('Expected either "storage", "private" or "public" as the Path domain but found ' + v.domain + ". Find out more about the Path type here: https://docs.onflow.org/cadence/json-cadence-spec/#path");
        }
        if (!isString(v.identifier)) {
          throwTypeError("Expected a string for the Path identifier but found " + v.identifier + ". Find out more about the Path type here: https://docs.onflow.org/cadence/json-cadence-spec/#path");
        }
        return {
          type: "Path",
          value: {
            domain: v.domain,
            identifier: v.identifier
          }
        };
      }
      throwTypeError("Expected Object for type Path");
    }, function(v) {
      return v;
    });
    exports.Address = Address;
    exports.Array = _Array;
    exports.Bool = Bool;
    exports.Character = Character;
    exports.Dictionary = Dictionary;
    exports.Event = Event;
    exports.Fix64 = Fix64;
    exports.Identity = Identity;
    exports.Int = Int;
    exports.Int128 = Int128;
    exports.Int16 = Int16;
    exports.Int256 = Int256;
    exports.Int32 = Int32;
    exports.Int64 = Int64;
    exports.Int8 = Int8;
    exports.Optional = Optional;
    exports.Path = Path;
    exports.Reference = Reference;
    exports.Resource = Resource;
    exports.String = String2;
    exports.Struct = Struct;
    exports.UFix64 = UFix64;
    exports.UInt = UInt;
    exports.UInt128 = UInt128;
    exports.UInt16 = UInt16;
    exports.UInt256 = UInt256;
    exports.UInt32 = UInt32;
    exports.UInt64 = UInt64;
    exports.UInt8 = UInt8;
    exports.Void = Void;
    exports.Word16 = Word16;
    exports.Word32 = Word32;
    exports.Word64 = Word64;
    exports.Word8 = Word8;
    exports._Array = _Array;
  }
});

// node_modules/@onflow/util-uid/dist/util-uid.js
var require_util_uid = __commonJS({
  "node_modules/@onflow/util-uid/dist/util-uid.js"(exports) {
    init_shims();
    var HEX = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var T = HEX.length;
    function uid() {
      var str = "", num = 32;
      while (num--) {
        str += HEX[Math.random() * T | 0];
      }
      return str;
    }
    exports.uid = uid;
  }
});

// node_modules/@onflow/fcl/dist/fcl.js
var require_fcl = __commonJS({
  "node_modules/@onflow/fcl/dist/fcl.js"(exports) {
    init_shims();
    var config$1 = require_config();
    var utilInvariant = require_util_invariant();
    var sdk = require_sdk();
    var t$1 = require_types();
    var utilActor = require_actor();
    var utilAddress = require_util_address();
    var rlp = require_rlp();
    var utilUid = require_util_uid();
    var utilTemplate = require_template();
    function _interopNamespace(e2) {
      if (e2 && e2.__esModule)
        return e2;
      var n = /* @__PURE__ */ Object.create(null);
      if (e2) {
        Object.keys(e2).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e2, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e2[k];
              }
            });
          }
        });
      }
      n["default"] = e2;
      return n;
    }
    var sdk__namespace = /* @__PURE__ */ _interopNamespace(sdk);
    var t__namespace = /* @__PURE__ */ _interopNamespace(t$1);
    var rlp__namespace = /* @__PURE__ */ _interopNamespace(rlp);
    var VERSION = "1.0.2";
    var getDiscoveryService = function getDiscoveryService2() {
      try {
        return Promise.resolve(config$1.config.first(["discovery.wallet", "challenge.handshake"])).then(function(discoveryWallet) {
          return Promise.resolve(config$1.config.get("discovery.authn.include", [])).then(function(discoveryAuthnInclude) {
            return Promise.resolve(config$1.config.first(["discovery.wallet.method", "discovery.wallet.method.default"])).then(function(discoveryWalletMethod) {
              return {
                type: "authn",
                endpoint: discoveryWallet,
                method: discoveryWalletMethod,
                discoveryAuthnInclude
              };
            });
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var configLens = function configLens2(regex) {
      try {
        return Promise.resolve(config$1.config().where(regex)).then(function(_config$where) {
          return Object.fromEntries(Object.entries(_config$where).map(function(_ref) {
            var key2 = _ref[0], value = _ref[1];
            return [key2.replace(regex, ""), value];
          }));
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var isServerSide = function isServerSide2() {
      return typeof window === "undefined";
    };
    var SESSION_STORAGE = {
      can: !isServerSide(),
      get: function(key2) {
        try {
          return Promise.resolve(JSON.parse(sessionStorage.getItem(key2)));
        } catch (e2) {
          return Promise.reject(e2);
        }
      },
      put: function(key2, value) {
        try {
          return Promise.resolve(sessionStorage.setItem(key2, JSON.stringify(value)));
        } catch (e2) {
          return Promise.reject(e2);
        }
      }
    };
    var STORAGE_DEFAULT = SESSION_STORAGE;
    var DISCOVERY_METHOD = "IFRAME/RPC";
    config$1.config({
      "discovery.wallet.method.default": DISCOVERY_METHOD,
      "fcl.storage.default": STORAGE_DEFAULT
    });
    var is = function is2(type) {
      return function(d) {
        return typeof d === type;
      };
    };
    var isRequired = function isRequired2(d) {
      return d != null;
    };
    var isObject = is("object");
    var isString = is("string");
    var isFunc = is("function");
    var isNumber = is("number");
    function normalizeArgs(ax) {
      if (isFunc(ax))
        return ax(sdk__namespace.arg, t__namespace);
      return [];
    }
    var preQuery = function preQuery2(opts) {
      try {
        utilInvariant.invariant(isRequired(opts.cadence), "query({ cadence }) -- cadence is required");
        utilInvariant.invariant(isString(opts.cadence), "query({ cadence }) -- cadence must be a string");
        return Promise.resolve(sdk__namespace.config.get("accessNode.api")).then(function(_sdk$config$get) {
          utilInvariant.invariant(_sdk$config$get, 'Required value for "accessNode.api" not defined in config. See: https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/exec/query.md#configuration');
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var query = function query2(opts) {
      if (opts === void 0) {
        opts = {};
      }
      return Promise.resolve(preQuery(opts)).then(function() {
        return sdk__namespace.send([sdk__namespace.script(opts.cadence), sdk__namespace.args(normalizeArgs(opts.args || [])), opts.limit && typeof opts.limit === "number" && sdk__namespace.limit(opts.limit)]).then(sdk__namespace.decode);
      });
    };
    function _extends$2() {
      _extends$2 = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      return _extends$2.apply(this, arguments);
    }
    function _unsupportedIterableToArray$1(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray$1(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray$1(o, minLen);
    }
    function _arrayLikeToArray$1(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++)
        arr2[i2] = arr[i2];
      return arr2;
    }
    function _createForOfIteratorHelperLoose$1(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it)
        return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i2 = 0;
        return function() {
          if (i2 >= o.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o[i2++]
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var fetchServices = function fetchServices2(servicesURL, code) {
      try {
        if (servicesURL == null || code == null)
          return Promise.resolve([]);
        var url = new URL(servicesURL);
        url.searchParams.append("code", code);
        return Promise.resolve(fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }).then(function(d) {
          return d.json();
        })).then(function(resp) {
          if (Array.isArray(resp))
            return resp;
          var services = [];
          if (Array.isArray(resp.authorizations)) {
            for (var _iterator = _createForOfIteratorHelperLoose$1(resp.authorizations), _step; !(_step = _iterator()).done; ) {
              var service = _step.value;
              services.push(_extends$2({
                type: "authz",
                keyId: resp.keyId
              }, service));
            }
          }
          if (resp.provider != null) {
            services.push(_extends$2({
              type: "authn",
              id: "wallet-provider#authn"
            }, resp.provider));
          }
          return services;
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function mergeServices(sx1, sx2) {
      if (sx1 === void 0) {
        sx1 = [];
      }
      if (sx2 === void 0) {
        sx2 = [];
      }
      return [].concat(sx1, sx2);
    }
    var SERVICE_PRAGMA = {
      f_type: "Service",
      f_vsn: "1.0.0"
    };
    var IDENTITY_PRAGMA = {
      f_type: "Identity",
      f_vsn: "1.0.0"
    };
    var USER_PRAGMA = {
      f_type: "USER",
      f_vsn: "1.0.0"
    };
    var POLLING_RESPONSE_PRAGMA = {
      f_type: "PollingResponse",
      f_vsn: "1.0.0"
    };
    var COMPOSITE_SIGNATURE_PRAGMA = {
      f_type: "CompositeSignature",
      f_vsn: "1.0.0"
    };
    function normalizeAuthn(service) {
      if (service == null)
        return null;
      switch (service["f_vsn"]) {
        case "1.0.0":
          return service;
        default:
          return _extends$2({}, SERVICE_PRAGMA, {
            type: service.type,
            uid: service.id,
            endpoint: service.authn,
            id: service.pid,
            provider: {
              address: utilAddress.withPrefix(service.addr),
              name: service.name,
              icon: service.icon
            }
          });
      }
    }
    function normalizeAuthz(service) {
      if (service == null)
        return null;
      switch (service["f_vsn"]) {
        case "1.0.0":
          return service;
        default:
          return _extends$2({}, SERVICE_PRAGMA, {
            type: service.type,
            uid: service.id,
            endpoint: service.endpoint,
            method: service.method,
            identity: _extends$2({}, IDENTITY_PRAGMA, {
              address: utilAddress.withPrefix(service.addr),
              keyId: service.keyId
            }),
            params: service.params,
            data: service.data
          });
      }
    }
    function normalizePreAuthz(service) {
      if (service == null)
        return null;
      switch (service["f_vsn"]) {
        case "1.0.0":
          return service;
        default:
          return _extends$2({}, SERVICE_PRAGMA, {
            type: service.type,
            uid: service.id,
            endpoint: service.endpoint,
            method: service.method,
            identity: _extends$2({}, IDENTITY_PRAGMA, {
              address: utilAddress.withPrefix(service.addr),
              keyId: service.keyId
            }),
            params: service.params,
            data: service.data
          });
      }
    }
    function normalizeFrame(service) {
      if (service == null)
        return null;
      switch (service["f_vsn"]) {
        case "1.0.0":
          return service;
        default:
          return _extends$2({
            old: service
          }, SERVICE_PRAGMA, {
            type: "frame",
            endpoint: service.endpoint,
            params: service.params || {},
            data: service.data || {}
          });
      }
    }
    function normalizeBackChannelRpc(service) {
      if (service == null)
        return null;
      switch (service["f_vsn"]) {
        case "1.0.0":
          return service;
        default:
          return _extends$2({}, SERVICE_PRAGMA, {
            type: "back-channel-rpc",
            endpoint: service.endpoint,
            method: service.method,
            params: service.params || {},
            data: service.data || {}
          });
      }
    }
    function normalizeOpenId(service) {
      if (service == null)
        return null;
      switch (service["f_vsn"]) {
        case "1.0.0":
          return service;
        default:
          return null;
      }
    }
    function normalizeUserSignature(service) {
      if (service == null)
        return null;
      switch (service["f_vsn"]) {
        case "1.0.0":
          return service;
        default:
          throw new Error("Invalid user-signature service");
      }
    }
    function normalizeLocalView(resp) {
      if (resp == null)
        return null;
      if (resp.method == null) {
        resp = _extends$2({}, resp, {
          type: "local-view",
          method: "VIEW/IFRAME"
        });
      }
      switch (resp["f_vsn"]) {
        case "1.0.0":
          return resp;
        default:
          return _extends$2({}, SERVICE_PRAGMA, {
            type: resp.type || "local-view",
            method: resp.method,
            endpoint: resp.endpoint,
            data: resp.data || {},
            params: resp.params || {}
          });
      }
    }
    function normalizeAccountProof(service) {
      if (service == null)
        return null;
      switch (service["f_vsn"]) {
        case "1.0.0":
          return service;
        default:
          throw new Error("FCL Normalizer Error: Invalid account-proof service");
      }
    }
    function normalizeAuthnRefresh(service) {
      if (service == null)
        return null;
      switch (service["f_vsn"]) {
        case "1.0.0":
          return service;
        default:
          throw new Error("Invalid authn-refresh service");
      }
    }
    var serviceNormalizers = {
      "back-channel-rpc": normalizeBackChannelRpc,
      "pre-authz": normalizePreAuthz,
      authz: normalizeAuthz,
      authn: normalizeAuthn,
      frame: normalizeFrame,
      "open-id": normalizeOpenId,
      "user-signature": normalizeUserSignature,
      "local-view": normalizeLocalView,
      "account-proof": normalizeAccountProof,
      "authn-refresh": normalizeAuthnRefresh
    };
    function normalizeService(service, data) {
      try {
        var normalized = serviceNormalizers[service.type](service, data);
        return normalized;
      } catch (error2) {
        console.error("Unrecognized FCL Service Type [" + service.type + "]", service, error2);
        return service;
      }
    }
    function deriveCompositeId(authn2) {
      return rlp__namespace.encode([authn2.provider.address || authn2.provider.name || "UNSPECIFIED", authn2.id]).toString("hex");
    }
    function normalizeData(data) {
      data.addr = data.addr ? utilAddress.withPrefix(data.addr) : null;
      data.paddr = data.paddr ? utilAddress.withPrefix(data.paddr) : null;
      return data;
    }
    function findService(type, services) {
      return services.find(function(d) {
        return d.type === type;
      });
    }
    var buildUser = function buildUser2(data) {
      try {
        data = normalizeData(data);
        var _temp2 = data.services || [];
        return Promise.resolve(fetchServices(data.hks, data.code)).then(function(_fetchServices) {
          var services = mergeServices(_temp2, _fetchServices).map(function(service) {
            return normalizeService(service, data);
          });
          var authn2 = findService("authn", services);
          return _extends$2({}, USER_PRAGMA, {
            addr: utilAddress.withPrefix(data.addr),
            cid: deriveCompositeId(authn2),
            loggedIn: true,
            services,
            expiresAt: data.expires
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function serviceOfType(services, type) {
      if (services === void 0) {
        services = [];
      }
      return services.find(function(service) {
        return service.type === type;
      });
    }
    function serviceEndpoint(service) {
      var url = new URL(service.endpoint);
      url.searchParams.append("l6n", window.location.origin);
      if (service.params != null) {
        for (var _i = 0, _Object$entries = Object.entries(service.params || {}); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _Object$entries[_i], key2 = _Object$entries$_i[0], value = _Object$entries$_i[1];
          url.searchParams.append(key2, value);
        }
      }
      return url;
    }
    function fetchService(service, opts) {
      if (opts === void 0) {
        opts = {};
      }
      var method = opts.method || "POST";
      var body = method === "GET" ? void 0 : JSON.stringify(opts.data || service.data || {});
      return fetch(serviceEndpoint(service), {
        method,
        headers: _extends$2({}, service.headers || {}, opts.headers || {}, {
          "Content-Type": "application/json"
        }),
        body
      }).then(function(d) {
        return d.json();
      });
    }
    function normalizePollingResponse(resp) {
      var _resp$status, _resp$reason;
      if (resp == null)
        return null;
      switch (resp["f_vsn"]) {
        case "1.0.0":
          return resp;
        default:
          return _extends$2({}, POLLING_RESPONSE_PRAGMA, {
            status: (_resp$status = resp.status) != null ? _resp$status : "APPROVED",
            reason: (_resp$reason = resp.reason) != null ? _resp$reason : null,
            data: resp.compositeSignature || resp.data || _extends$2({}, resp) || {},
            updates: normalizeBackChannelRpc(resp.authorizationUpdates),
            local: normalizeFrame((resp.local || [])[0])
          });
      }
    }
    var poll = function poll2(service, canContinue) {
      if (canContinue === void 0) {
        canContinue = function canContinue2() {
          return true;
        };
      }
      try {
        utilInvariant.invariant(service, "Missing Polling Service", {
          service
        });
        if (!canContinue())
          throw new Error("Externally Halted");
        return Promise.resolve(fetchService(service, {
          method: serviceMethod(service)
        }).then(normalizePollingResponse)).then(function(resp) {
          switch (resp.status) {
            case "APPROVED":
              return resp.data;
            case "DECLINED":
              throw new Error("Declined: " + (resp.reason || "No reason supplied."));
            default:
              return Promise.resolve(new Promise(function(r2) {
                return setTimeout(r2, 500);
              })).then(function() {
                return poll2(resp.updates, canContinue);
              });
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var OPTIONS = {
      "HTTP/GET": "GET",
      "HTTP/POST": "POST"
    };
    var serviceMethod = function serviceMethod2(service) {
      utilInvariant.invariant(OPTIONS[service.method], "Invalid Service Method for type back-channel-rpc", {
        service
      });
      return OPTIONS[service.method];
    };
    var FRAME = "FCL_IFRAME";
    var FRAME_STYLES = "\n  position:fixed;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n  height: 100%;\n  width: 100vw;\n  display:block;\n  background:rgba(0,0,0,0.25);\n  z-index: 2147483647;\n  box-sizing: border-box;\n";
    function renderFrame(src) {
      utilInvariant.invariant(!document.getElementById(FRAME), "Attempt at triggering multiple Frames", {
        src
      });
      var $frame = document.createElement("iframe");
      $frame.src = src;
      $frame.id = FRAME;
      $frame.allow = "usb *; hid *";
      $frame.frameBorder = "0";
      $frame.style.cssText = FRAME_STYLES;
      document.body.append($frame);
      var unmount = function unmount2() {
        if (document.getElementById(FRAME)) {
          document.getElementById(FRAME).remove();
        }
      };
      return [$frame.contentWindow, unmount];
    }
    var POP = "FCL_POP";
    var popup = null;
    var previousUrl$1 = null;
    function popupWindow(url, windowName, win, w, h2) {
      var y = win.top.outerHeight / 2 + win.top.screenY - h2 / 2;
      var x2 = win.top.outerWidth / 2 + win.top.screenX - w / 2;
      return win.open(url, windowName, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + w + ", height=" + h2 + ", top=" + y + ", left=" + x2);
    }
    function renderPop(src) {
      var _popup;
      if (popup == null || (_popup = popup) != null && _popup.closed) {
        popup = popupWindow(src, POP, window, 640, 770);
      } else if (previousUrl$1 !== src) {
        popup.location.replace(src);
        popup.focus();
      } else {
        popup.focus();
      }
      previousUrl$1 = src;
      var unmount = function unmount2() {
        if (popup && !popup.closed) {
          popup.close();
        }
        popup = null;
      };
      return [popup, unmount];
    }
    var tab$1 = null;
    var previousUrl = null;
    function renderTab(src) {
      var _tab;
      if (tab$1 == null || (_tab = tab$1) != null && _tab.closed) {
        tab$1 = window.open(src, "_blank");
      } else if (previousUrl !== src) {
        tab$1.location.replace(src);
        tab$1.focus();
      } else {
        tab$1.focus();
      }
      previousUrl = src;
      var unmount = function unmount2() {
        if (tab$1 && !tab$1.closed) {
          tab$1.close();
        }
        tab$1 = null;
      };
      return [tab$1, unmount];
    }
    var execLocal = function execLocal2(service, opts) {
      if (opts === void 0) {
        opts = {};
      }
      try {
        try {
          return Promise.resolve(VIEWS[service.method](serviceEndpoint(service), opts));
        } catch (error2) {
          console.error("execLocal({service, opts = {}})", error2, {
            service,
            opts
          });
          throw error2;
        }
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var VIEWS = {
      "VIEW/IFRAME": renderFrame,
      "VIEW/POP": renderPop,
      "VIEW/TAB": renderTab
    };
    var execHttpPost = function execHttpPost2(service, signable, opts, config3) {
      try {
        return Promise.resolve(fetchService(service, {
          data: _extends$2({
            fclVersion: VERSION,
            service: {
              params: service.params,
              data: service.data,
              type: service.type
            },
            config: config3
          }, signable)
        }).then(normalizePollingResponse)).then(function(resp) {
          if (resp.status === "APPROVED") {
            return resp.data;
          } else if (resp.status === "DECLINED") {
            throw new Error("Declined: " + (resp.reason || "No reason supplied."));
          } else if (resp.status === "REDIRECT") {
            return resp;
          } else if (resp.status === "PENDING") {
            var canContinue = true;
            return Promise.resolve(execLocal(normalizeLocalView(resp.local))).then(function(_ref) {
              var _2 = _ref[0], unmount = _ref[1];
              var close2 = function close3() {
                try {
                  unmount();
                  canContinue = false;
                } catch (error2) {
                  console.error("Frame Close Error", error2);
                }
              };
              return poll(resp.updates, function() {
                return canContinue;
              }).then(function(serviceResponse) {
                close2();
                return serviceResponse;
              })["catch"](function(error2) {
                console.error(error2);
                close2();
                throw error2;
              });
            });
          } else {
            console.error("Auto Decline: Invalid Response", {
              service,
              resp
            });
            throw new Error("Auto Decline: Invalid Response");
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var CLOSE_EVENT = "FCL:VIEW:CLOSE";
    var READY_EVENT = "FCL:VIEW:READY";
    var RESPONSE_EVENT = "FCL:VIEW:RESPONSE";
    var _ = function _2(e2) {
      return typeof e2 === "string" && e2.toLowerCase();
    };
    var IGNORE = /* @__PURE__ */ new Set(["monetizationstart", "monetizationpending", "monetizationprogress", "monetizationstop"]);
    var deprecate$1 = function deprecate3(was, want) {
      return console.warn("DEPRECATION NOTICE", "Received " + was + ", please use " + want + " for this and future versions of FCL");
    };
    var buildMessageHandler = function buildMessageHandler2(_ref) {
      var close2 = _ref.close, send = _ref.send, onReady = _ref.onReady, onResponse = _ref.onResponse, onMessage = _ref.onMessage;
      return function(e2) {
        try {
          if (typeof e2.data !== "object")
            return;
          if (IGNORE.has(e2.data.type))
            return;
          if (_(e2.data.type) === _(CLOSE_EVENT))
            close2();
          if (_(e2.data.type) === _(READY_EVENT))
            onReady(e2, {
              send,
              close: close2
            });
          if (_(e2.data.type) === _(RESPONSE_EVENT))
            onResponse(e2, {
              send,
              close: close2
            });
          onMessage(e2, {
            send,
            close: close2
          });
          if (_(e2.data.type) === _("FCL:FRAME:READY")) {
            deprecate$1(e2.data.type, READY_EVENT);
            onReady(e2, {
              send,
              close: close2
            });
          }
          if (_(e2.data.type) === _("FCL:FRAME:RESPONSE")) {
            deprecate$1(e2.data.type, RESPONSE_EVENT);
            onResponse(e2, {
              send,
              close: close2
            });
          }
          if (_(e2.data.type) === _("FCL:FRAME:CLOSE")) {
            deprecate$1(e2.data.type, CLOSE_EVENT);
            close2();
          }
          if (_(e2.data.type) === _("FCL::CHALLENGE::RESPONSE")) {
            deprecate$1(e2.data.type, RESPONSE_EVENT);
            onResponse(e2, {
              send,
              close: close2
            });
          }
          if (_(e2.data.type) === _("FCL::AUTHZ_READY")) {
            deprecate$1(e2.data.type, READY_EVENT);
            onReady(e2, {
              send,
              close: close2
            });
          }
          if (_(e2.data.type) === _("FCL::CHALLENGE::CANCEL")) {
            deprecate$1(e2.data.type, CLOSE_EVENT);
            close2();
          }
          if (_(e2.data.type) === _("FCL::CANCEL")) {
            deprecate$1(e2.data.type, CLOSE_EVENT);
            close2();
          }
        } catch (error2) {
          console.error("Frame Callback Error", error2);
          close2();
        }
      };
    };
    var noop$4 = function noop5() {
    };
    function frame(service, opts) {
      if (opts === void 0) {
        opts = {};
      }
      if (service == null)
        return {
          send: noop$4,
          close: noop$4
        };
      var onClose = opts.onClose || noop$4;
      var onMessage = opts.onMessage || noop$4;
      var onReady = opts.onReady || noop$4;
      var onResponse = opts.onResponse || noop$4;
      window.addEventListener("message", buildMessageHandler({
        close: close2,
        send,
        onReady,
        onResponse,
        onMessage
      }));
      var _renderFrame = renderFrame(serviceEndpoint(service)), $frame = _renderFrame[0], unmount = _renderFrame[1];
      return {
        send,
        close: close2
      };
      function close2() {
        try {
          window.removeEventListener("message", buildMessageHandler);
          unmount();
          onClose();
        } catch (error2) {
          console.error("Frame Close Error", error2);
        }
      }
      function send(msg) {
        try {
          $frame.postMessage(JSON.parse(JSON.stringify(msg || {})), "*");
        } catch (error2) {
          console.error("Frame Send Error", msg, error2);
        }
      }
    }
    function execIframeRPC(service, body, opts, config3) {
      return new Promise(function(resolve2, reject) {
        var id = utilUid.uid();
        var includeOlderJsonRpcCall = opts.includeOlderJsonRpcCall;
        frame(service, {
          onReady: function onReady(_2, _ref) {
            var send = _ref.send;
            try {
              try {
                send({
                  type: "FCL:VIEW:READY:RESPONSE",
                  fclVersion: VERSION,
                  body,
                  service: {
                    params: service.params,
                    data: service.data,
                    type: service.type
                  },
                  config: config3
                });
                send({
                  fclVersion: VERSION,
                  type: "FCL:FRAME:READY:RESPONSE",
                  body,
                  service: {
                    params: service.params,
                    data: service.data,
                    type: service.type
                  },
                  config: config3,
                  deprecated: {
                    message: "FCL:FRAME:READY:RESPONSE is deprecated and replaced with type: FCL:VIEW:READY:RESPONSE"
                  }
                });
                if (includeOlderJsonRpcCall) {
                  send({
                    jsonrpc: "2.0",
                    id,
                    method: "fcl:sign",
                    params: [body, service.params],
                    deprecated: {
                      message: "jsonrpc is deprecated and replaced with type: FCL:VIEW:READY:RESPONSE"
                    }
                  });
                }
              } catch (error2) {
                throw error2;
              }
              return Promise.resolve();
            } catch (e2) {
              return Promise.reject(e2);
            }
          },
          onResponse: function onResponse(e2, _ref2) {
            var close2 = _ref2.close;
            try {
              if (typeof e2.data !== "object")
                return;
              var resp = normalizePollingResponse(e2.data);
              switch (resp.status) {
                case "APPROVED":
                  resolve2(resp.data);
                  close2();
                  break;
                case "DECLINED":
                  reject("Declined: " + (resp.reason || "No reason supplied"));
                  close2();
                  break;
                case "REDIRECT":
                  resolve2(resp);
                  close2();
                  break;
                default:
                  reject("Declined: No reason supplied");
                  close2();
                  break;
              }
            } catch (error2) {
              console.error("execIframeRPC onResponse error", error2);
              throw error2;
            }
          },
          onMessage: function onMessage(e2, _ref3) {
            var close2 = _ref3.close;
            try {
              if (typeof e2.data !== "object")
                return;
              if (e2.data.jsonrpc !== "2.0")
                return;
              if (e2.data.id !== id)
                return;
              var resp = normalizePollingResponse(e2.data.result);
              switch (resp.status) {
                case "APPROVED":
                  resolve2(resp.data);
                  close2();
                  break;
                case "DECLINED":
                  reject("Declined: " + (resp.reason || "No reason supplied"));
                  close2();
                  break;
                case "REDIRECT":
                  resolve2(resp);
                  close2();
                  break;
                default:
                  reject("Declined: No reason supplied");
                  close2();
                  break;
              }
            } catch (error2) {
              console.error("execIframeRPC onMessage error", error2);
              throw error2;
            }
          },
          onClose: function onClose() {
            reject("Declined: Externally Halted");
          }
        });
      });
    }
    var noop$3 = function noop5() {
    };
    function pop(service, opts) {
      if (opts === void 0) {
        opts = {};
      }
      if (service == null)
        return {
          send: noop$3,
          close: noop$3
        };
      var onClose = opts.onClose || noop$3;
      var onMessage = opts.onMessage || noop$3;
      var onReady = opts.onReady || noop$3;
      var onResponse = opts.onResponse || noop$3;
      window.addEventListener("message", buildMessageHandler({
        close: close2,
        send,
        onReady,
        onResponse,
        onMessage
      }));
      var _renderPop = renderPop(serviceEndpoint(service)), $pop = _renderPop[0], unmount = _renderPop[1];
      var timer = setInterval(function() {
        if ($pop && $pop.closed) {
          close2();
        }
      }, 500);
      return {
        send,
        close: close2
      };
      function close2() {
        try {
          window.removeEventListener("message", buildMessageHandler);
          clearInterval(timer);
          unmount();
          onClose();
        } catch (error2) {
          console.error("Popup Close Error", error2);
        }
      }
      function send(msg) {
        try {
          $pop.postMessage(JSON.parse(JSON.stringify(msg || {})), "*");
        } catch (error2) {
          console.error("Popup Send Error", msg, error2);
        }
      }
    }
    function execPopRPC(service, body, opts, config3) {
      return new Promise(function(resolve2, reject) {
        var id = utilUid.uid();
        var redir = opts.redir, includeOlderJsonRpcCall = opts.includeOlderJsonRpcCall;
        pop(service, {
          onReady: function onReady(_2, _ref) {
            var send = _ref.send;
            try {
              try {
                send({
                  fclVersion: VERSION,
                  type: "FCL:VIEW:READY:RESPONSE",
                  body,
                  service: {
                    params: service.params,
                    data: service.data,
                    type: service.type
                  },
                  config: config3
                });
                send({
                  fclVersion: VERSION,
                  type: "FCL:FRAME:READY:RESPONSE",
                  body,
                  service: {
                    params: service.params,
                    data: service.data,
                    type: service.type
                  },
                  config: config3,
                  deprecated: {
                    message: "FCL:FRAME:READY:RESPONSE is deprecated and replaced with type: FCL:VIEW:READY:RESPONSE"
                  }
                });
                if (includeOlderJsonRpcCall) {
                  send({
                    jsonrpc: "2.0",
                    id,
                    method: "fcl:sign",
                    params: [body, service.params]
                  });
                }
              } catch (error2) {
                throw error2;
              }
              return Promise.resolve();
            } catch (e2) {
              return Promise.reject(e2);
            }
          },
          onResponse: function onResponse(e2, _ref2) {
            var close2 = _ref2.close;
            try {
              if (typeof e2.data !== "object")
                return;
              var resp = normalizePollingResponse(e2.data);
              switch (resp.status) {
                case "APPROVED":
                  resolve2(resp.data);
                  !redir && close2();
                  break;
                case "DECLINED":
                  reject("Declined: " + (resp.reason || "No reason supplied"));
                  close2();
                  break;
                case "REDIRECT":
                  resolve2(resp);
                  close2();
                  break;
                default:
                  reject("Declined: No reason supplied");
                  close2();
                  break;
              }
            } catch (error2) {
              console.error("execPopRPC onResponse error", error2);
              throw error2;
            }
          },
          onMessage: function onMessage(e2, _ref3) {
            var close2 = _ref3.close;
            try {
              if (typeof e2.data !== "object")
                return;
              if (e2.data.jsonrpc !== "2.0")
                return;
              if (e2.data.id !== id)
                return;
              var resp = normalizePollingResponse(e2.data.result);
              switch (resp.status) {
                case "APPROVED":
                  resolve2(resp.data);
                  !redir && close2();
                  break;
                case "DECLINED":
                  reject("Declined: " + (resp.reason || "No reason supplied"));
                  close2();
                  break;
                case "REDIRECT":
                  resolve2(resp);
                  close2();
                  break;
                default:
                  reject("Declined: No reason supplied");
                  close2();
                  break;
              }
            } catch (error2) {
              console.error("execPopRPC onMessage error", error2);
              throw error2;
            }
          },
          onClose: function onClose() {
            reject("Declined: Externally Halted");
          }
        });
      });
    }
    var noop$2 = function noop5() {
    };
    function tab(service, opts) {
      if (opts === void 0) {
        opts = {};
      }
      if (service == null)
        return {
          send: noop$2,
          close: noop$2
        };
      var onClose = opts.onClose || noop$2;
      var onMessage = opts.onMessage || noop$2;
      var onReady = opts.onReady || noop$2;
      var onResponse = opts.onResponse || noop$2;
      window.addEventListener("message", buildMessageHandler({
        close: close2,
        send,
        onReady,
        onResponse,
        onMessage
      }));
      var _renderTab = renderTab(serviceEndpoint(service)), $tab = _renderTab[0], unmount = _renderTab[1];
      var timer = setInterval(function() {
        if ($tab && $tab.closed) {
          close2();
        }
      }, 500);
      return {
        send,
        close: close2
      };
      function close2() {
        try {
          window.removeEventListener("message", buildMessageHandler);
          clearInterval(timer);
          unmount();
          onClose();
        } catch (error2) {
          console.error("Tab Close Error", error2);
        }
      }
      function send(msg) {
        try {
          $tab.postMessage(JSON.parse(JSON.stringify(msg || {})), "*");
        } catch (error2) {
          console.error("Tab Send Error", msg, error2);
        }
      }
    }
    function execTabRPC(service, body, opts, config3) {
      return new Promise(function(resolve2, reject) {
        var id = utilUid.uid();
        var redir = opts.redir, includeOlderJsonRpcCall = opts.includeOlderJsonRpcCall;
        tab(service, {
          onReady: function onReady(_2, _ref) {
            var send = _ref.send;
            try {
              try {
                send({
                  fclVersion: VERSION,
                  type: "FCL:VIEW:READY:RESPONSE",
                  body,
                  service: {
                    params: service.params,
                    data: service.data,
                    type: service.type
                  },
                  config: config3
                });
                send({
                  fclVersion: VERSION,
                  type: "FCL:FRAME:READY:RESPONSE",
                  body,
                  service: {
                    params: service.params,
                    data: service.data,
                    type: service.type
                  },
                  config: config3,
                  deprecated: {
                    message: "FCL:FRAME:READY:RESPONSE is deprecated and replaced with type: FCL:VIEW:READY:RESPONSE"
                  }
                });
                if (includeOlderJsonRpcCall) {
                  send({
                    jsonrpc: "2.0",
                    id,
                    method: "fcl:sign",
                    params: [body, service.params]
                  });
                }
              } catch (error2) {
                throw error2;
              }
              return Promise.resolve();
            } catch (e2) {
              return Promise.reject(e2);
            }
          },
          onResponse: function onResponse(e2, _ref2) {
            var close2 = _ref2.close;
            try {
              if (typeof e2.data !== "object")
                return;
              var resp = normalizePollingResponse(e2.data);
              switch (resp.status) {
                case "APPROVED":
                  resolve2(resp.data);
                  !redir && close2();
                  break;
                case "DECLINED":
                  reject("Declined: " + (resp.reason || "No reason supplied"));
                  close2();
                  break;
                case "REDIRECT":
                  resolve2(resp);
                  close2();
                  break;
                default:
                  reject("Declined: No reason supplied");
                  close2();
                  break;
              }
            } catch (error2) {
              console.error("execPopRPC onResponse error", error2);
              throw error2;
            }
          },
          onMessage: function onMessage(e2, _ref3) {
            var close2 = _ref3.close;
            try {
              if (typeof e2.data !== "object")
                return;
              if (e2.data.jsonrpc !== "2.0")
                return;
              if (e2.data.id !== id)
                return;
              var resp = normalizePollingResponse(e2.data.result);
              switch (resp.status) {
                case "APPROVED":
                  resolve2(resp.data);
                  !redir && close2();
                  break;
                case "DECLINED":
                  reject("Declined: " + (resp.reason || "No reason supplied"));
                  close2();
                  break;
                case "REDIRECT":
                  resolve2(resp);
                  close2();
                  break;
                default:
                  reject("Declined: No reason supplied");
                  close2();
                  break;
              }
            } catch (error2) {
              console.error("execPopRPC onMessage error", error2);
              throw error2;
            }
          },
          onClose: function onClose() {
            reject("Declined: Externally Halted");
          }
        });
      });
    }
    var noop$1 = function noop5() {
    };
    function extension(service, opts) {
      if (opts === void 0) {
        opts = {};
      }
      if (service == null)
        return {
          send: noop$1,
          close: noop$1
        };
      var onClose = opts.onClose || noop$1;
      var onMessage = opts.onMessage || noop$1;
      var onReady = opts.onReady || noop$1;
      var onResponse = opts.onResponse || noop$1;
      window.addEventListener("message", buildMessageHandler({
        close: close2,
        send,
        onReady,
        onResponse,
        onMessage
      }));
      send({
        service
      });
      return {
        send,
        close: close2
      };
      function close2() {
        try {
          window.removeEventListener("message", buildMessageHandler);
          onClose();
        } catch (error2) {
          console.error("Ext Close Error", error2);
        }
      }
      function send(msg) {
        try {
          window && window.postMessage(JSON.parse(JSON.stringify(msg || {})), "*");
        } catch (error2) {
          console.error("Ext Send Error", msg, error2);
        }
      }
    }
    function execExtRPC(service, body, opts, config3) {
      return new Promise(function(resolve2, reject) {
        extension(service, {
          onReady: function onReady(_2, _ref) {
            var send = _ref.send;
            try {
              try {
                send({
                  fclVersion: VERSION,
                  type: "FCL:VIEW:READY:RESPONSE",
                  body,
                  service: {
                    params: service.params,
                    data: service.data,
                    type: service.type
                  },
                  config: config3
                });
              } catch (error2) {
                throw error2;
              }
              return Promise.resolve();
            } catch (e2) {
              return Promise.reject(e2);
            }
          },
          onResponse: function onResponse(e2, _ref2) {
            var close2 = _ref2.close;
            try {
              if (typeof e2.data !== "object")
                return;
              var resp = normalizePollingResponse(e2.data);
              switch (resp.status) {
                case "APPROVED":
                  resolve2(resp.data);
                  close2();
                  break;
                case "DECLINED":
                  reject("Declined: " + (resp.reason || "No reason supplied"));
                  close2();
                  break;
                case "REDIRECT":
                  resolve2(resp);
                  close2();
                  break;
                default:
                  reject("Declined: No reason supplied");
                  close2();
                  break;
              }
            } catch (error2) {
              console.error("execExtRPC onResponse error", error2);
              throw error2;
            }
          },
          onClose: function onClose() {
            reject("Declined: Externally Halted");
          }
        });
      });
    }
    function _catch$5(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var execService = function execService2(_ref) {
      var service = _ref.service, _ref$msg = _ref.msg, msg = _ref$msg === void 0 ? {} : _ref$msg, _ref$opts = _ref.opts, opts = _ref$opts === void 0 ? {} : _ref$opts, _ref$config = _ref.config, config3 = _ref$config === void 0 ? {} : _ref$config;
      try {
        msg.data = service.data;
        return Promise.resolve(configLens(/^service\./)).then(function(_configLens) {
          return Promise.resolve(configLens(/^app\.detail\./)).then(function(_configLens2) {
            var _window$location$host, _window, _window$location, _window2;
            var fullConfig = _extends$2({}, config3, {
              services: _configLens,
              app: _configLens2,
              client: {
                fclVersion: VERSION,
                fclLibrary: "https://github.com/onflow/fcl-js",
                hostname: (_window$location$host = (_window = window) == null ? void 0 : (_window$location = _window.location) == null ? void 0 : _window$location.hostname) != null ? _window$location$host : null,
                extensions: ((_window2 = window) == null ? void 0 : _window2.fcl_extensions) || []
              }
            });
            return _catch$5(function() {
              return Promise.resolve(STRATEGIES[service.method](service, msg, opts, fullConfig)).then(function(res) {
                if (res.status === "REDIRECT") {
                  utilInvariant.invariant(service.type === res.data.type, "Cannot shift recursive service type in execService");
                  return Promise.resolve(execService2({
                    service: res.data,
                    msg,
                    opts,
                    config: fullConfig
                  }));
                } else {
                  return res;
                }
              });
            }, function(error2) {
              console.error("execService({service, msg = {}, opts = {}, config = {}})", error2, {
                service,
                msg,
                opts,
                config: config3
              });
              throw error2;
            });
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var STRATEGIES = {
      "HTTP/RPC": execHttpPost,
      "HTTP/POST": execHttpPost,
      "IFRAME/RPC": execIframeRPC,
      "POP/RPC": execPopRPC,
      "TAB/RPC": execTabRPC,
      "EXT/RPC": execExtRPC
    };
    function normalizeCompositeSignature(resp) {
      if (resp == null)
        return null;
      switch (resp["f_vsn"]) {
        case "1.0.0":
          return resp;
        default:
          return _extends$2({}, COMPOSITE_SIGNATURE_PRAGMA, {
            addr: utilAddress.sansPrefix(resp.addr || resp.address),
            signature: resp.signature || resp.sig,
            keyId: resp.keyId
          });
      }
    }
    var _HANDLERS$4;
    function _settle$1(pact, state, value) {
      if (!pact.s) {
        if (value instanceof _Pact$1) {
          if (value.s) {
            if (state & 1) {
              state = value.s;
            }
            value = value.v;
          } else {
            value.o = _settle$1.bind(null, pact, state);
            return;
          }
        }
        if (value && value.then) {
          value.then(_settle$1.bind(null, pact, state), _settle$1.bind(null, pact, 2));
          return;
        }
        pact.s = state;
        pact.v = value;
        var observer = pact.o;
        if (observer) {
          observer(pact);
        }
      }
    }
    var signUserMessage = function signUserMessage2(msg) {
      try {
        spawnCurrentUser();
        return Promise.resolve(authenticate$1({
          redir: true
        })).then(function(user2) {
          var signingService = serviceOfType(user2.services, "user-signature");
          utilInvariant.invariant(signingService, "Current user must have authorized a signing service.");
          return _catch$4(function() {
            return Promise.resolve(execService({
              service: signingService,
              msg: makeSignable(msg)
            })).then(function(response) {
              if (Array.isArray(response)) {
                return response.map(function(compSigs) {
                  return normalizeCompositeSignature(compSigs);
                });
              } else {
                return [normalizeCompositeSignature(response)];
              }
            });
          }, function(error2) {
            return error2;
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var _Pact$1 = /* @__PURE__ */ function() {
      function _Pact2() {
      }
      _Pact2.prototype.then = function(onFulfilled, onRejected) {
        var result = new _Pact2();
        var state = this.s;
        if (state) {
          var callback = state & 1 ? onFulfilled : onRejected;
          if (callback) {
            try {
              _settle$1(result, 1, callback(this.v));
            } catch (e2) {
              _settle$1(result, 2, e2);
            }
            return result;
          } else {
            return this;
          }
        }
        this.o = function(_this) {
          try {
            var value = _this.v;
            if (_this.s & 1) {
              _settle$1(result, 1, onFulfilled ? onFulfilled(value) : value);
            } else if (onRejected) {
              _settle$1(result, 1, onRejected(value));
            } else {
              _settle$1(result, 2, value);
            }
          } catch (e2) {
            _settle$1(result, 2, e2);
          }
        };
        return result;
      };
      return _Pact2;
    }();
    function _isSettledPact$1(thenable) {
      return thenable instanceof _Pact$1 && thenable.s & 1;
    }
    function _for$1(test, update2, body) {
      var stage;
      for (; ; ) {
        var shouldContinue = test();
        if (_isSettledPact$1(shouldContinue)) {
          shouldContinue = shouldContinue.v;
        }
        if (!shouldContinue) {
          return result;
        }
        if (shouldContinue.then) {
          stage = 0;
          break;
        }
        var result = body();
        if (result && result.then) {
          if (_isSettledPact$1(result)) {
            result = result.s;
          } else {
            stage = 1;
            break;
          }
        }
        if (update2) {
          var updateValue = update2();
          if (updateValue && updateValue.then && !_isSettledPact$1(updateValue)) {
            stage = 2;
            break;
          }
        }
      }
      var pact = new _Pact$1();
      var reject = _settle$1.bind(null, pact, 2);
      (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
      return pact;
      function _resumeAfterBody(value) {
        result = value;
        do {
          if (update2) {
            updateValue = update2();
            if (updateValue && updateValue.then && !_isSettledPact$1(updateValue)) {
              updateValue.then(_resumeAfterUpdate).then(void 0, reject);
              return;
            }
          }
          shouldContinue = test();
          if (!shouldContinue || _isSettledPact$1(shouldContinue) && !shouldContinue.v) {
            _settle$1(pact, 1, result);
            return;
          }
          if (shouldContinue.then) {
            shouldContinue.then(_resumeAfterTest).then(void 0, reject);
            return;
          }
          result = body();
          if (_isSettledPact$1(result)) {
            result = result.v;
          }
        } while (!result || !result.then);
        result.then(_resumeAfterBody).then(void 0, reject);
      }
      function _resumeAfterTest(shouldContinue2) {
        if (shouldContinue2) {
          result = body();
          if (result && result.then) {
            result.then(_resumeAfterBody).then(void 0, reject);
          } else {
            _resumeAfterBody(result);
          }
        } else {
          _settle$1(pact, 1, result);
        }
      }
      function _resumeAfterUpdate() {
        if (shouldContinue = test()) {
          if (shouldContinue.then) {
            shouldContinue.then(_resumeAfterTest).then(void 0, reject);
          } else {
            _resumeAfterTest(shouldContinue);
          }
        } else {
          _settle$1(pact, 1, result);
        }
      }
    }
    var resolveArgument = function resolveArgument2() {
      return Promise.resolve(authenticate$1()).then(function(_ref4) {
        var addr = _ref4.addr;
        return sdk.arg(utilAddress.withPrefix(addr), t__namespace.Address);
      });
    };
    function _catch$4(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    function _finally(body, finalizer) {
      try {
        var result = body();
      } catch (e2) {
        return finalizer();
      }
      if (result && result.then) {
        return result.then(finalizer, finalizer);
      }
      return finalizer();
    }
    var authorization = function authorization2(account) {
      try {
        spawnCurrentUser();
        return Promise.resolve(_extends$2({}, account, {
          tempId: "CURRENT_USER",
          resolve: function resolve2(account2, preSignable) {
            try {
              return Promise.resolve(authenticate$1({
                redir: true
              })).then(function(user2) {
                var _exit5;
                function _temp9(_result5) {
                  if (_exit5)
                    return _result5;
                  if (authz2)
                    return _extends$2({}, account2, {
                      tempId: "CURRENT_USER",
                      resolve: null,
                      addr: utilAddress.sansPrefix(authz2.identity.address),
                      keyId: authz2.identity.keyId,
                      sequenceNum: null,
                      signature: null,
                      signingFunction: function signingFunction(signable) {
                        try {
                          return Promise.resolve(execService({
                            service: authz2,
                            msg: signable,
                            opts: {
                              includeOlderJsonRpcCall: true
                            }
                          })).then(normalizeCompositeSignature);
                        } catch (e2) {
                          return Promise.reject(e2);
                        }
                      }
                    });
                  throw new Error("No Authz or PreAuthz Service configured for CURRENT_USER");
                }
                var authz2 = serviceOfType(user2.services, "authz");
                var preAuthz = serviceOfType(user2.services, "pre-authz");
                var _temp8 = function() {
                  if (preAuthz) {
                    return Promise.resolve(execService({
                      service: preAuthz,
                      msg: preSignable
                    })).then(function(_execService) {
                      var _resolvePreAuthz = resolvePreAuthz(_execService);
                      _exit5 = 1;
                      return _resolvePreAuthz;
                    });
                  }
                }();
                return _temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8);
              });
            } catch (e2) {
              return Promise.reject(e2);
            }
          }
        }));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    function _finallyRethrows$1(body, finalizer) {
      try {
        var result = body();
      } catch (e2) {
        return finalizer(true, e2);
      }
      if (result && result.then) {
        return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
      }
      return finalizer(false, result);
    }
    var authenticate$1 = function authenticate2(_temp2) {
      var _ref2 = _temp2 === void 0 ? {} : _temp2, service = _ref2.service, _ref2$redir = _ref2.redir, redir = _ref2$redir === void 0 ? false : _ref2$redir;
      try {
        return Promise.resolve(new Promise(function(resolve2, reject) {
          try {
            spawnCurrentUser();
            var opts = {
              redir
            };
            return Promise.resolve(snapshot()).then(function(user2) {
              return Promise.resolve(getDiscoveryService()).then(function(discoveryService) {
                var _exit3;
                function _temp7(_result2) {
                  var _exit4;
                  if (_exit3)
                    return _result2;
                  function _temp5(_result3) {
                    if (_exit4)
                      return _result3;
                    var _temp3 = _finallyRethrows$1(function() {
                      return _catch$4(function() {
                        return Promise.resolve(execService({
                          service: _extends$2({}, service || discoveryService, {
                            method: (discoveryService == null ? void 0 : discoveryService.method) || service.method || "IFRAME/RPC"
                          }),
                          msg: accountProofData,
                          opts,
                          config: {
                            discoveryAuthnInclude: discoveryService.discoveryAuthnInclude
                          }
                        })).then(function(response) {
                          return Promise.resolve(buildUser(response)).then(function(_buildUser2) {
                            utilActor.send(NAME$2, SET_CURRENT_USER, _buildUser2);
                          });
                        });
                      }, function(e2) {
                        console.error("Error while authenticating", e2);
                      });
                    }, function(_wasThrown, _result4) {
                      return Promise.resolve(snapshot()).then(function(_snapshot2) {
                        resolve2(_snapshot2);
                        if (_wasThrown)
                          throw _result4;
                        return _result4;
                      });
                    });
                    if (_temp3 && _temp3.then)
                      return _temp3.then(function() {
                      });
                  }
                  utilInvariant.invariant(service || discoveryService.endpoint, '\n        If no service passed to "authenticate," then "discovery.wallet" must be defined in config.\n        See: "https://docs.onflow.org/fcl/reference/api/#setting-configuration-values"\n      ');
                  var _temp4 = function() {
                    if (user2.loggedIn) {
                      if (refreshService) {
                        return _finally(function() {
                          return _catch$4(function() {
                            return Promise.resolve(execService({
                              service: refreshService,
                              msg: accountProofData,
                              opts
                            })).then(function(response) {
                              return Promise.resolve(buildUser(response)).then(function(_buildUser) {
                                utilActor.send(NAME$2, SET_CURRENT_USER, _buildUser);
                              });
                            });
                          }, function(e2) {
                            console.error("Error: Could not refresh authentication.", e2);
                          });
                        }, function() {
                          return Promise.resolve(snapshot()).then(function(_snapshot) {
                            var _resolve = resolve2(_snapshot);
                            _exit4 = 1;
                            return _resolve;
                          });
                        });
                      } else {
                        var _resolve3 = resolve2(user2);
                        _exit4 = 1;
                        return _resolve3;
                      }
                    }
                  }();
                  return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
                }
                var refreshService = serviceOfType(user2.services, "authn-refresh");
                var accountProofData;
                var _temp6 = _catch$4(function() {
                  return Promise.resolve(getAccountProofData()).then(function(_getAccountProofData) {
                    accountProofData = _getAccountProofData;
                  });
                }, function(error2) {
                  console.error("Error During Authentication: Could not resolve account proof data.\n        " + error2);
                  var _reject = reject(error2);
                  _exit3 = 1;
                  return _reject;
                });
                return _temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6);
              });
            });
          } catch (e2) {
            return Promise.reject(e2);
          }
        }));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var getAccountProofData = function getAccountProofData2() {
      try {
        return Promise.resolve(config$1.config.get("fcl.accountProof.resolver")).then(function(accountProofDataResolver) {
          function _temp10(accountProofData) {
            if (accountProofData == null)
              return;
            utilInvariant.invariant(typeof accountProofData.appIdentifier === "string", "appIdentifier must be a string");
            utilInvariant.invariant(/^[0-9a-f]+$/i.test(accountProofData.nonce), "Nonce must be a hex string");
            return accountProofData;
          }
          return accountProofDataResolver ? Promise.resolve(accountProofDataResolver()).then(_temp10) : _temp10(accountProofDataResolver);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var NAME$2 = "CURRENT_USER";
    var UPDATED$3 = "CURRENT_USER/UPDATED";
    var SNAPSHOT$1 = "SNAPSHOT";
    var SET_CURRENT_USER = "SET_CURRENT_USER";
    var DEL_CURRENT_USER = "DEL_CURRENT_USER";
    var DATA = '{\n  "f_type": "User",\n  "f_vsn": "1.0.0",\n  "addr":null,\n  "cid":null,\n  "loggedIn":null,\n  "expiresAt":null,\n  "services":[]\n}';
    var getStoredUser = function getStoredUser2(storage) {
      try {
        var fallback = JSON.parse(DATA);
        return Promise.resolve(storage.get(NAME$2)).then(function(stored) {
          if (stored != null && fallback["f_vsn"] !== stored["f_vsn"]) {
            storage.removeItem(NAME$2);
            return fallback;
          }
          return stored || fallback;
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var HANDLERS$4 = (_HANDLERS$4 = {}, _HANDLERS$4[utilActor.INIT] = function(ctx) {
      try {
        if (typeof window === "undefined") {
          console.warn('\n        %cFCL Warning\n        ============================\n        "currentUser" is only available in the browser.\n        For more info, please see the docs: https://docs.onflow.org/fcl/\n        ============================\n        ', "font-weight:bold;font-family:monospace;");
        }
        ctx.merge(JSON.parse(DATA));
        return Promise.resolve(config$1.config.first(["fcl.storage", "fcl.storage.default"])).then(function(storage) {
          var _temp = function() {
            if (storage.can) {
              return Promise.resolve(getStoredUser(storage)).then(function(user2) {
                if (notExpired(user2))
                  ctx.merge(user2);
              });
            }
          }();
          if (_temp && _temp.then)
            return _temp.then(function() {
            });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS$4[utilActor.SUBSCRIBE] = function(ctx, letter) {
      ctx.subscribe(letter.from);
      ctx.send(letter.from, UPDATED$3, _extends$2({}, ctx.all()));
    }, _HANDLERS$4[utilActor.UNSUBSCRIBE] = function(ctx, letter) {
      ctx.unsubscribe(letter.from);
    }, _HANDLERS$4[SNAPSHOT$1] = function(ctx, letter) {
      try {
        letter.reply(_extends$2({}, ctx.all()));
        return Promise.resolve();
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS$4[SET_CURRENT_USER] = function(ctx, letter, data) {
      try {
        ctx.merge(data);
        return Promise.resolve(config$1.config.first(["fcl.storage", "fcl.storage.default"])).then(function(storage) {
          if (storage.can)
            storage.put(NAME$2, ctx.all());
          ctx.broadcast(UPDATED$3, _extends$2({}, ctx.all()));
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS$4[DEL_CURRENT_USER] = function(ctx, letter) {
      try {
        ctx.merge(JSON.parse(DATA));
        return Promise.resolve(config$1.config.first(["fcl.storage", "fcl.storage.default"])).then(function(storage) {
          if (storage.can)
            storage.put(NAME$2, ctx.all());
          ctx.broadcast(UPDATED$3, _extends$2({}, ctx.all()));
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS$4);
    var spawnCurrentUser = function spawnCurrentUser2() {
      return utilActor.spawn(HANDLERS$4, NAME$2);
    };
    function notExpired(user2) {
      return user2.expiresAt == null || user2.expiresAt === 0 || user2.expiresAt > Date.now();
    }
    function unauthenticate$1() {
      spawnCurrentUser();
      utilActor.send(NAME$2, DEL_CURRENT_USER);
    }
    var normalizePreAuthzResponse = function normalizePreAuthzResponse2(authz2) {
      return {
        f_type: "PreAuthzResponse",
        f_vsn: "1.0.0",
        proposer: (authz2 || {}).proposer,
        payer: (authz2 || {}).payer || [],
        authorization: (authz2 || {}).authorization || []
      };
    };
    function resolvePreAuthz(authz2) {
      var resp = normalizePreAuthzResponse(authz2);
      var axs = [];
      if (resp.proposer != null)
        axs.push(["PROPOSER", resp.proposer]);
      for (var _iterator = _createForOfIteratorHelperLoose$1(resp.payer || []), _step; !(_step = _iterator()).done; ) {
        var az = _step.value;
        axs.push(["PAYER", az]);
      }
      for (var _iterator2 = _createForOfIteratorHelperLoose$1(resp.authorization || []), _step2; !(_step2 = _iterator2()).done; ) {
        var _az = _step2.value;
        axs.push(["AUTHORIZER", _az]);
      }
      var result = axs.map(function(_ref) {
        var role = _ref[0], az2 = _ref[1];
        return {
          tempId: [az2.identity.address, az2.identity.keyId].join("|"),
          addr: az2.identity.address,
          keyId: az2.identity.keyId,
          signingFunction: function signingFunction(signable) {
            return execService({
              service: az2,
              msg: signable
            });
          },
          role: {
            proposer: role === "PROPOSER",
            payer: role === "PAYER",
            authorizer: role === "AUTHORIZER"
          }
        };
      });
      return result;
    }
    function subscribe$1(callback) {
      spawnCurrentUser();
      var EXIT2 = "@EXIT";
      var self2 = utilActor.spawn(function(ctx) {
        try {
          var _exit2;
          ctx.send(NAME$2, utilActor.SUBSCRIBE);
          return Promise.resolve(_for$1(function() {
            return !_exit2 && 1;
          }, void 0, function() {
            return Promise.resolve(ctx.receive()).then(function(letter) {
              if (letter.tag === EXIT2) {
                ctx.send(NAME$2, utilActor.UNSUBSCRIBE);
                _exit2 = 1;
                return;
              }
              callback(letter.data);
            });
          }));
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
      return function() {
        return utilActor.send(self2, EXIT2);
      };
    }
    function snapshot() {
      spawnCurrentUser();
      return utilActor.send(NAME$2, SNAPSHOT$1, null, {
        expectReply: true,
        timeout: 0
      });
    }
    var makeSignable = function makeSignable2(msg) {
      utilInvariant.invariant(/^[0-9a-f]+$/i.test(msg), "Message must be a hex string");
      return {
        message: msg
      };
    };
    var currentUser = function currentUser2() {
      return {
        authenticate: authenticate$1,
        unauthenticate: unauthenticate$1,
        authorization,
        signUserMessage,
        subscribe: subscribe$1,
        snapshot,
        resolveArgument
      };
    };
    currentUser.authenticate = authenticate$1;
    currentUser.unauthenticate = unauthenticate$1;
    currentUser.authorization = authorization;
    currentUser.signUserMessage = signUserMessage;
    currentUser.subscribe = subscribe$1;
    currentUser.snapshot = snapshot;
    currentUser.resolveArgument = resolveArgument;
    var _HANDLERS$3;
    function _catch$3(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var RATE$1 = 2500;
    var POLL = "POLL";
    var fetchTxStatus = function fetchTxStatus2(transactionId) {
      try {
        return Promise.resolve(sdk.send([sdk.getTransactionStatus(transactionId)]).then(sdk.decode));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var isExpired = function isExpired2(tx) {
      return tx.status === 5;
    };
    var isSealed = function isSealed2(tx) {
      return tx.status >= 4;
    };
    var isExecuted = function isExecuted2(tx) {
      return tx.status >= 3;
    };
    var isFinalized = function isFinalized2(tx) {
      return tx.status >= 2;
    };
    var isPending = function isPending2(tx) {
      return tx.status >= 1;
    };
    var isUnknown = function isUnknown2(tx) {
      return tx.status >= 0;
    };
    var isDiff = function isDiff2(cur, next) {
      return JSON.stringify(cur) !== JSON.stringify(next);
    };
    var HANDLERS$3 = (_HANDLERS$3 = {}, _HANDLERS$3[utilActor.INIT] = function(ctx) {
      try {
        return Promise.resolve(fetchTxStatus(ctx.self())).then(function(tx) {
          if (!isSealed(tx))
            setTimeout(function() {
              return ctx.sendSelf(POLL);
            }, RATE$1);
          ctx.merge(tx);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS$3[utilActor.SUBSCRIBE] = function(ctx, letter) {
      ctx.subscribe(letter.from);
      ctx.send(letter.from, utilActor.UPDATED, ctx.all());
    }, _HANDLERS$3[utilActor.UNSUBSCRIBE] = function(ctx, letter) {
      ctx.unsubscribe(letter.from);
    }, _HANDLERS$3[utilActor.SNAPSHOT] = function(ctx, letter) {
      try {
        letter.reply(ctx.all());
        return Promise.resolve();
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS$3[POLL] = function(ctx) {
      try {
        var _temp3 = function _temp32(_result) {
          if (_exit2)
            return _result;
          if (!isSealed(tx))
            setTimeout(function() {
              return ctx.sendSelf(POLL);
            }, RATE$1);
          if (isDiff(ctx.all(), tx))
            ctx.broadcast(utilActor.UPDATED, tx);
          ctx.merge(tx);
        };
        var _exit2;
        var tx;
        var _temp4 = _catch$3(function() {
          return Promise.resolve(fetchTxStatus(ctx.self())).then(function(_fetchTxStatus) {
            tx = _fetchTxStatus;
          });
        }, function(e2) {
          console.error(e2);
          setTimeout(function() {
            return ctx.sendSelf(POLL);
          }, RATE$1);
          _exit2 = 1;
        });
        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS$3);
    var scoped = function scoped2(transactionId) {
      if (typeof transactionId === "object")
        transactionId = transactionId.transactionId;
      if (transactionId == null)
        throw new Error("transactionId required");
      return transactionId;
    };
    var spawnTransaction = function spawnTransaction2(transactionId) {
      return utilActor.spawn(HANDLERS$3, scoped(transactionId));
    };
    function transaction(transactionId) {
      function snapshot2() {
        return utilActor.snapshoter(transactionId, spawnTransaction);
      }
      function subscribe3(callback) {
        return utilActor.subscriber(scoped(transactionId), spawnTransaction, callback);
      }
      function once(predicate) {
        return function innerOnce(opts) {
          if (opts === void 0) {
            opts = {};
          }
          var suppress = opts.suppress || false;
          return new Promise(function(resolve2, reject) {
            var unsub = subscribe3(function(txStatus) {
              if (txStatus.statusCode && !suppress) {
                reject(txStatus.errorMessage);
                unsub();
              } else if (predicate(txStatus)) {
                resolve2(txStatus);
                unsub();
              }
            });
          });
        };
      }
      return {
        snapshot: snapshot2,
        subscribe: subscribe3,
        onceFinalized: once(isFinalized),
        onceExecuted: once(isExecuted),
        onceSealed: once(isSealed)
      };
    }
    transaction.isUnknown = isUnknown;
    transaction.isPending = isPending;
    transaction.isFinalized = isFinalized;
    transaction.isExecuted = isExecuted;
    transaction.isSealed = isSealed;
    transaction.isExpired = isExpired;
    function _catch$2(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var prepMutation = function prepMutation2(opts) {
      try {
        utilInvariant.invariant(isRequired(opts), "mutate(opts) -- opts is required");
        utilInvariant.invariant(isObject(opts), "mutate(opts) -- opts must be an object");
        utilInvariant.invariant(isRequired(opts.cadence), "mutate({ cadence }) -- cadence is required");
        utilInvariant.invariant(isString(opts.cadence), "mutate({ cadence }) -- cadence must be a string");
        return Promise.resolve(sdk__namespace.config.get("accessNode.api")).then(function(_sdk$config$get) {
          utilInvariant.invariant(_sdk$config$get, 'Required value for "accessNode.api" not defined in config. See: https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/exec/query.md#configuration');
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var mutate = function mutate2(opts) {
      if (opts === void 0) {
        opts = {};
      }
      try {
        var txid;
        return Promise.resolve(_catch$2(function() {
          return Promise.resolve(prepMutation(opts)).then(function() {
            return Promise.resolve(sdk__namespace.config().get("fcl.authz", currentUser().authorization)).then(function(authz2) {
              txid = sdk__namespace.send([
                sdk__namespace.transaction(opts.cadence),
                sdk__namespace.args(normalizeArgs(opts.args || [])),
                opts.limit && isNumber(opts.limit) && sdk__namespace.limit(opts.limit),
                sdk__namespace.proposer(opts.proposer || opts.authz || authz2),
                sdk__namespace.payer(opts.payer || opts.authz || authz2),
                sdk__namespace.authorizations(opts.authorizations || [opts.authz || authz2])
              ]).then(sdk__namespace.decode);
              return txid;
            });
          });
        }, function(error2) {
          throw error2;
        }));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var onMessageFromFCL = function onMessageFromFCL2(messageType, cb) {
      if (cb === void 0) {
        cb = function cb2() {
        };
      }
      var buildData = function buildData2(data) {
        var _data$body;
        if (data.deprecated)
          console.warn("DEPRECATION NOTICE", data.deprecated.message);
        data == null ? true : (_data$body = data.body) == null ? true : delete _data$body.interaction;
        return data;
      };
      var internal = function internal2(e2) {
        var data = e2.data;
        if (typeof data !== "object")
          return;
        if (typeof data == null)
          return;
        if (data.type !== messageType)
          return;
        cb(buildData(data));
      };
      window.addEventListener("message", internal);
      return function() {
        return window.removeEventListener("message", internal);
      };
    };
    var sendMsgToFCL = function sendMsgToFCL2(type, msg) {
      if (msg === void 0) {
        msg = {};
      }
      if (window.location !== window.parent.location) {
        window.parent.postMessage(_extends$2({}, msg, {
          type
        }), "*");
      } else {
        window.opener.postMessage(_extends$2({}, msg, {
          type
        }), "*");
      }
    };
    var ready = function ready2(cb, msg) {
      onMessageFromFCL("FCL:VIEW:READY:RESPONSE", cb);
      sendMsgToFCL("FCL:VIEW:READY");
    };
    var close = function close2() {
      sendMsgToFCL("FCL:VIEW:CLOSE");
    };
    var approve = function approve2(data) {
      sendMsgToFCL("FCL:VIEW:RESPONSE", {
        f_type: "PollingResponse",
        f_vsn: "1.0.0",
        status: "APPROVED",
        reason: null,
        data
      });
    };
    var decline = function decline2(reason) {
      sendMsgToFCL("FCL:VIEW:RESPONSE", {
        f_type: "PollingResponse",
        f_vsn: "1.0.0",
        status: "DECLINED",
        reason,
        data: null
      });
    };
    var redirect = function redirect2(data) {
      sendMsgToFCL("FCL:VIEW:RESPONSE", {
        f_type: "PollingResponse",
        f_vsn: "1.0.0",
        status: "REDIRECT",
        reason: null,
        data
      });
    };
    function CompositeSignature(addr, keyId, signature) {
      this.f_type = COMPOSITE_SIGNATURE_PRAGMA.f_type;
      this.f_vsn = COMPOSITE_SIGNATURE_PRAGMA.f_vsn;
      this.addr = utilAddress.withPrefix(addr);
      this.keyId = Number(keyId);
      this.signature = signature;
    }
    var rightPaddedHexBuffer = function rightPaddedHexBuffer2(value, pad) {
      return rlp.Buffer.from(value.padEnd(pad * 2, "0"), "hex");
    };
    var leftPaddedHexBuffer = function leftPaddedHexBuffer2(value, pad) {
      return rlp.Buffer.from(value.padStart(pad * 2, "0"), "hex");
    };
    var addressBuffer = function addressBuffer2(addr) {
      return leftPaddedHexBuffer(addr, 8);
    };
    var nonceBuffer = function nonceBuffer2(nonce) {
      return rlp.Buffer.from(nonce, "hex");
    };
    var encodeAccountProof = function encodeAccountProof2(_ref, includeDomainTag) {
      var address = _ref.address, nonce = _ref.nonce, appIdentifier = _ref.appIdentifier;
      if (includeDomainTag === void 0) {
        includeDomainTag = true;
      }
      utilInvariant.invariant(address, "Encode Message For Provable Authn Error: address must be defined");
      utilInvariant.invariant(nonce, "Encode Message For Provable Authn Error: nonce must be defined");
      utilInvariant.invariant(appIdentifier, "Encode Message For Provable Authn Error: appIdentifier must be defined");
      utilInvariant.invariant(nonce.length >= 64, "Encode Message For Provable Authn Error: nonce must be minimum of 32 bytes");
      var ACCOUNT_PROOF_DOMAIN_TAG = rightPaddedHexBuffer(rlp.Buffer.from("FCL-ACCOUNT-PROOF-V0.0").toString("hex"), 32);
      if (includeDomainTag) {
        return rlp.Buffer.concat([ACCOUNT_PROOF_DOMAIN_TAG, rlp.encode([appIdentifier, addressBuffer(utilAddress.sansPrefix(address)), nonceBuffer(nonce)])]).toString("hex");
      }
      return rlp.encode([appIdentifier, addressBuffer(utilAddress.sansPrefix(address)), nonceBuffer(nonce)]).toString("hex");
    };
    function injectExtService(service) {
      if (service.type === "authn" && service.endpoint != null) {
        if (!Array.isArray(window.fcl_extensions)) {
          window.fcl_extensions = [];
        }
        window.fcl_extensions.push(service);
      } else {
        console.warn("Authn service is required");
      }
    }
    var index$1 = {
      __proto__: null,
      sendMsgToFCL,
      ready,
      close,
      approve,
      decline,
      redirect,
      onMessageFromFCL,
      encodeMessageFromSignable: sdk.encodeMessageFromSignable,
      CompositeSignature,
      encodeAccountProof,
      injectExtService
    };
    var verifyUserSignatures$1 = function verifyUserSignatures2(message, compSigs, opts) {
      if (opts === void 0) {
        opts = {};
      }
      try {
        validateArgs({
          message,
          compSigs
        });
        var address = compSigs[0].addr;
        var signaturesArr = [];
        var keyIndices = [];
        for (var _iterator2 = _createForOfIteratorHelperLoose$1(compSigs), _step2; !(_step2 = _iterator2()).done; ) {
          var el = _step2.value;
          signaturesArr.push(el.signature);
          keyIndices.push(el.keyId);
        }
        return Promise.resolve(getVerifySignaturesScript(USER_SIGNATURE, opts)).then(function(_getVerifySignaturesS2) {
          return query({
            cadence: _getVerifySignaturesS2,
            args: function args(arg, t3) {
              return [arg(address, t3.Address), arg(message, t3.String), arg(keyIndices, t3.Array([t3.Int])), arg(signaturesArr, t3.Array([t3.String]))];
            }
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var verifyAccountProof = function verifyAccountProof2(appIdentifier, _ref, opts) {
      var address = _ref.address, nonce = _ref.nonce, signatures = _ref.signatures;
      if (opts === void 0) {
        opts = {};
      }
      try {
        validateArgs({
          appIdentifier,
          address,
          nonce,
          signatures
        });
        var message = encodeAccountProof({
          address,
          nonce,
          appIdentifier
        }, false);
        var signaturesArr = [];
        var keyIndices = [];
        for (var _iterator = _createForOfIteratorHelperLoose$1(signatures), _step; !(_step = _iterator()).done; ) {
          var el = _step.value;
          signaturesArr.push(el.signature);
          keyIndices.push(el.keyId);
        }
        return Promise.resolve(getVerifySignaturesScript(ACCOUNT_PROOF, opts)).then(function(_getVerifySignaturesS) {
          return query({
            cadence: _getVerifySignaturesS,
            args: function args(arg, t3) {
              return [arg(address, t3.Address), arg(message, t3.String), arg(keyIndices, t3.Array([t3.Int])), arg(signaturesArr, t3.Array([t3.String]))];
            }
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var ACCOUNT_PROOF = "ACCOUNT_PROOF";
    var USER_SIGNATURE = "USER_SIGNATURE";
    var validateArgs = function validateArgs2(args) {
      if (args.appIdentifier) {
        var appIdentifier = args.appIdentifier, address = args.address, nonce = args.nonce, signatures = args.signatures;
        utilInvariant.invariant(isString(appIdentifier), "verifyAccountProof({ appIdentifier }) -- appIdentifier must be a string");
        utilInvariant.invariant(isString(address) && utilAddress.sansPrefix(address).length === 16, "verifyAccountProof({ address }) -- address must be a valid address");
        utilInvariant.invariant(/^[0-9a-f]+$/i.test(nonce), "nonce must be a hex string");
        utilInvariant.invariant(Array.isArray(signatures) && signatures.every(function(sig, i2, arr) {
          return sig.f_type === "CompositeSignature";
        }), "Must include an Array of CompositeSignatures to verify");
        utilInvariant.invariant(signatures.map(function(cs) {
          return cs.addr;
        }).every(function(addr, i2, arr) {
          return addr === arr[0];
        }), "User signatures to be verified must be from a single account address");
        return true;
      } else {
        var message = args.message, compSigs = args.compSigs;
        utilInvariant.invariant(/^[0-9a-f]+$/i.test(message), "Signed message must be a hex string");
        utilInvariant.invariant(Array.isArray(compSigs) && compSigs.every(function(sig, i2, arr) {
          return sig.f_type === "CompositeSignature";
        }), "Must include an Array of CompositeSignatures to verify");
        utilInvariant.invariant(compSigs.map(function(cs) {
          return cs.addr;
        }).every(function(addr, i2, arr) {
          return addr === arr[0];
        }), "User signatures to be verified must be from a single account address");
        return true;
      }
    };
    var getVerifySignaturesScript = function getVerifySignaturesScript2(sig, opts) {
      try {
        var verifyFunction = sig === "ACCOUNT_PROOF" ? "verifyAccountProofSignatures" : "verifyUserSignatures";
        return Promise.resolve(config$1.config.first(["env", "flow.network"])).then(function(network) {
          var fclCryptoContract;
          utilInvariant.invariant(opts.fclCryptoContract || network === "testnet" || network === "mainnet", "${verifyFunction}({ fclCryptoContract }) -- config.flow.network must be specified (testnet || mainnet) or contract address provided via opts.fclCryptoContract");
          if (opts.fclCryptoContract) {
            fclCryptoContract = opts.fclCryptoContract;
          } else {
            fclCryptoContract = network === "testnet" ? "0x74daa6f9c7ef24b1" : "0xb4b82a1c9d21d284";
          }
          return "\n      import FCLCrypto from " + fclCryptoContract + "\n\n      pub fun main(\n          address: Address, \n          message: String, \n          keyIndices: [Int], \n          signatures: [String]\n      ): Bool {\n        return FCLCrypto." + verifyFunction + "(address: address, message: message, keyIndices: keyIndices, signatures: signatures)\n      }\n    ";
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var index5 = {
      __proto__: null,
      verifyAccountProof,
      verifyUserSignatures: verifyUserSignatures$1
    };
    var promise;
    var queueMicrotask_1 = typeof queueMicrotask === "function" ? queueMicrotask : function(cb) {
      return (promise || (promise = Promise.resolve())).then(cb)["catch"](function(err) {
        return setTimeout(function() {
          throw err;
        }, 0);
      });
    };
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
        arr2[i2] = arr[i2];
      }
      return arr2;
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it)
        return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i2 = 0;
        return function() {
          if (i2 >= o.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o[i2++]
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var mailbox = function mailbox2() {
      var queue = [];
      var next;
      return {
        deliver: function deliver(msg) {
          try {
            queue.push(msg);
            if (next) {
              next(queue.shift());
              next = void 0;
            }
            return Promise.resolve();
          } catch (e2) {
            return Promise.reject(e2);
          }
        },
        receive: function receive() {
          return new Promise(function innerReceive(resolve2) {
            var msg = queue.shift();
            if (msg)
              return resolve2(msg);
            next = resolve2;
          });
        }
      };
    };
    function _catch(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    function _finallyRethrows(body, finalizer) {
      try {
        var result = body();
      } catch (e2) {
        return finalizer(true, e2);
      }
      if (result && result.then) {
        return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
      }
      return finalizer(false, result);
    }
    function _settle(pact, state, value) {
      if (!pact.s) {
        if (value instanceof _Pact) {
          if (value.s) {
            if (state & 1) {
              state = value.s;
            }
            value = value.v;
          } else {
            value.o = _settle.bind(null, pact, state);
            return;
          }
        }
        if (value && value.then) {
          value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
          return;
        }
        pact.s = state;
        pact.v = value;
        var observer = pact.o;
        if (observer) {
          observer(pact);
        }
      }
    }
    var _Pact = /* @__PURE__ */ function() {
      function _Pact2() {
      }
      _Pact2.prototype.then = function(onFulfilled, onRejected) {
        var result = new _Pact2();
        var state = this.s;
        if (state) {
          var callback = state & 1 ? onFulfilled : onRejected;
          if (callback) {
            try {
              _settle(result, 1, callback(this.v));
            } catch (e2) {
              _settle(result, 2, e2);
            }
            return result;
          } else {
            return this;
          }
        }
        this.o = function(_this) {
          try {
            var value = _this.v;
            if (_this.s & 1) {
              _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
            } else if (onRejected) {
              _settle(result, 1, onRejected(value));
            } else {
              _settle(result, 2, value);
            }
          } catch (e2) {
            _settle(result, 2, e2);
          }
        };
        return result;
      };
      return _Pact2;
    }();
    function _isSettledPact(thenable) {
      return thenable instanceof _Pact && thenable.s & 1;
    }
    function _for(test, update2, body) {
      var stage;
      for (; ; ) {
        var shouldContinue = test();
        if (_isSettledPact(shouldContinue)) {
          shouldContinue = shouldContinue.v;
        }
        if (!shouldContinue) {
          return result;
        }
        if (shouldContinue.then) {
          stage = 0;
          break;
        }
        var result = body();
        if (result && result.then) {
          if (_isSettledPact(result)) {
            result = result.s;
          } else {
            stage = 1;
            break;
          }
        }
        if (update2) {
          var updateValue = update2();
          if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
            stage = 2;
            break;
          }
        }
      }
      var pact = new _Pact();
      var reject = _settle.bind(null, pact, 2);
      (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
      return pact;
      function _resumeAfterBody(value) {
        result = value;
        do {
          if (update2) {
            updateValue = update2();
            if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
              updateValue.then(_resumeAfterUpdate).then(void 0, reject);
              return;
            }
          }
          shouldContinue = test();
          if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
            _settle(pact, 1, result);
            return;
          }
          if (shouldContinue.then) {
            shouldContinue.then(_resumeAfterTest).then(void 0, reject);
            return;
          }
          result = body();
          if (_isSettledPact(result)) {
            result = result.v;
          }
        } while (!result || !result.then);
        result.then(_resumeAfterBody).then(void 0, reject);
      }
      function _resumeAfterTest(shouldContinue2) {
        if (shouldContinue2) {
          result = body();
          if (result && result.then) {
            result.then(_resumeAfterBody).then(void 0, reject);
          } else {
            _resumeAfterBody(result);
          }
        } else {
          _settle(pact, 1, result);
        }
      }
      function _resumeAfterUpdate() {
        if (shouldContinue = test()) {
          if (shouldContinue.then) {
            shouldContinue.then(_resumeAfterTest).then(void 0, reject);
          } else {
            _resumeAfterTest(shouldContinue);
          }
        } else {
          _settle(pact, 1, result);
        }
      }
    }
    var INIT = "INIT";
    var SUBSCRIBE = "SUBSCRIBE";
    var UNSUBSCRIBE = "UNSUBSCRIBE";
    var EXIT = "EXIT";
    var TERMINATE = "TERMINATE";
    var root = typeof self === "object" && self.self === self && self || typeof global === "object" && global.global === global && global || typeof window === "object" && window.window === window && window;
    root.FCL_REGISTRY = root.FCL_REGISTRY == null ? {} : root.FCL_REGISTRY;
    var pid = 0;
    var DEFAULT_TIMEOUT = 5e3;
    var _send = function send(addr, tag, data, opts) {
      if (opts === void 0) {
        opts = {};
      }
      return new Promise(function(reply, reject) {
        var expectReply = opts.expectReply || false;
        var timeout = opts.timeout != null ? opts.timeout : DEFAULT_TIMEOUT;
        if (expectReply && timeout) {
          setTimeout(function() {
            return reject(new Error("Timeout: " + timeout + "ms passed without a response."));
          }, timeout);
        }
        var payload = {
          to: addr,
          from: opts.from,
          tag,
          data,
          timeout,
          reply,
          reject
        };
        try {
          root.FCL_REGISTRY[addr] && root.FCL_REGISTRY[addr].mailbox.deliver(payload);
          if (!expectReply)
            reply(true);
        } catch (error2) {
          console.error("FCL.Actor -- Could Not Deliver Message", payload, root.FCL_REGISTRY[addr], error2);
        }
      });
    };
    var kill = function kill2(addr) {
      delete root.FCL_REGISTRY[addr];
    };
    var fromHandlers = function fromHandlers2(handlers) {
      if (handlers === void 0) {
        handlers = {};
      }
      return function(ctx) {
        try {
          var _temp12 = function _temp122() {
            var _loopInterrupt;
            var _temp6 = _for(function() {
              return !_loopInterrupt && 1;
            }, void 0, function() {
              return Promise.resolve(ctx.receive()).then(function(letter) {
                var _temp5 = _finallyRethrows(function() {
                  return _catch(function() {
                    function _temp4() {
                      return Promise.resolve(handlers[letter.tag](ctx, letter, letter.data || {})).then(function() {
                      });
                    }
                    var _temp3 = function() {
                      if (letter.tag === EXIT) {
                        var _temp10 = function _temp102() {
                          _loopInterrupt = 1;
                        };
                        var _temp11 = function() {
                          if (typeof handlers[TERMINATE] === "function") {
                            return Promise.resolve(handlers[TERMINATE](ctx, letter, letter.data || {})).then(function() {
                            });
                          }
                        }();
                        return _temp11 && _temp11.then ? _temp11.then(_temp10) : _temp10(_temp11);
                      }
                    }();
                    return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
                  }, function(error2) {
                    console.error(ctx.self() + " Error", letter, error2);
                  });
                }, function(_wasThrown, _result) {
                  return;
                  if (_wasThrown)
                    throw _result;
                  return _result;
                });
                if (_temp5 && _temp5.then)
                  return _temp5.then(function() {
                  });
              });
            });
            var _temp7 = function() {
              if (_temp6 && _temp6.then)
                return _temp6.then(function() {
                });
            }();
            if (_temp7 && _temp7.then)
              return _temp7.then(function() {
              });
          };
          var _temp13 = function() {
            if (typeof handlers[INIT] === "function")
              return Promise.resolve(handlers[INIT](ctx)).then(function() {
              });
          }();
          return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(_temp12) : _temp12(_temp13));
        } catch (e2) {
          return Promise.reject(e2);
        }
      };
    };
    var spawn = function spawn2(fn, addr) {
      if (addr === void 0) {
        addr = null;
      }
      if (addr == null)
        addr = ++pid;
      if (root.FCL_REGISTRY[addr] != null)
        return addr;
      root.FCL_REGISTRY[addr] = {
        addr,
        mailbox: mailbox(),
        subs: /* @__PURE__ */ new Set(),
        kvs: {}
      };
      var ctx = {
        self: function self2() {
          return addr;
        },
        receive: function receive() {
          return root.FCL_REGISTRY[addr].mailbox.receive();
        },
        send: function send(to, tag, data, opts) {
          if (opts === void 0) {
            opts = {};
          }
          opts.from = addr;
          return _send(to, tag, data, opts);
        },
        sendSelf: function sendSelf(tag, data, opts) {
          if (root.FCL_REGISTRY[addr])
            _send(addr, tag, data, opts);
        },
        broadcast: function broadcast(tag, data, opts) {
          if (opts === void 0) {
            opts = {};
          }
          opts.from = addr;
          for (var _iterator = _createForOfIteratorHelperLoose(root.FCL_REGISTRY[addr].subs), _step; !(_step = _iterator()).done; ) {
            var to = _step.value;
            _send(to, tag, data, opts);
          }
        },
        subscribe: function subscribe3(sub) {
          return sub != null && root.FCL_REGISTRY[addr].subs.add(sub);
        },
        unsubscribe: function unsubscribe(sub) {
          return sub != null && root.FCL_REGISTRY[addr].subs["delete"](sub);
        },
        subscriberCount: function subscriberCount() {
          return root.FCL_REGISTRY[addr].subs.size;
        },
        hasSubs: function hasSubs() {
          return !!root.FCL_REGISTRY[addr].subs.size;
        },
        put: function put2(key2, value) {
          if (key2 != null)
            root.FCL_REGISTRY[addr].kvs[key2] = value;
        },
        get: function get2(key2, fallback) {
          var value = root.FCL_REGISTRY[addr].kvs[key2];
          return value == null ? fallback : value;
        },
        "delete": function _delete2(key2) {
          delete root.FCL_REGISTRY[addr].kvs[key2];
        },
        update: function update2(key2, fn2) {
          if (key2 != null)
            root.FCL_REGISTRY[addr].kvs[key2] = fn2(root.FCL_REGISTRY[addr].kvs[key2]);
        },
        keys: function keys() {
          return Object.keys(root.FCL_REGISTRY[addr].kvs);
        },
        all: function all2() {
          return root.FCL_REGISTRY[addr].kvs;
        },
        where: function where2(pattern) {
          return Object.keys(root.FCL_REGISTRY[addr].kvs).reduce(function(acc, key2) {
            var _extends2;
            return pattern.test(key2) ? _extends({}, acc, (_extends2 = {}, _extends2[key2] = root.FCL_REGISTRY[addr].kvs[key2], _extends2)) : acc;
          }, {});
        },
        merge: function merge(data) {
          if (data === void 0) {
            data = {};
          }
          Object.keys(data).forEach(function(key2) {
            return root.FCL_REGISTRY[addr].kvs[key2] = data[key2];
          });
        }
      };
      if (typeof fn === "object")
        fn = fromHandlers(fn);
      queueMicrotask_1(function() {
        try {
          return Promise.resolve(fn(ctx)).then(function() {
            kill(addr);
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
      return addr;
    };
    function subscriber(address, spawnFn, callback) {
      spawnFn(address);
      var EXIT2 = "@EXIT";
      var self2 = spawn(function(ctx) {
        try {
          var _exit2;
          ctx.send(address, SUBSCRIBE);
          return Promise.resolve(_for(function() {
            return !_exit2 && 1;
          }, void 0, function() {
            return Promise.resolve(ctx.receive()).then(function(letter) {
              if (letter.tag === EXIT2) {
                ctx.send(address, UNSUBSCRIBE);
                _exit2 = 1;
                return;
              }
              callback(letter.data);
            });
          }));
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
      return function() {
        return _send(self2, EXIT2);
      };
    }
    function _extends$1() {
      _extends$1 = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      return _extends$1.apply(this, arguments);
    }
    typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
    typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")) : "@@asyncIterator";
    function _catch$1(body, recover) {
      try {
        var result = body();
      } catch (e2) {
        return recover(e2);
      }
      if (result && result.then) {
        return result.then(void 0, recover);
      }
      return result;
    }
    var _HANDLERS$2;
    var first = function first2(wants, fallback) {
      if (wants === void 0) {
        wants = [];
      }
      try {
        if (!wants.length)
          return Promise.resolve(fallback);
        var _wants = wants, head = _wants[0], rest = _wants.slice(1);
        return Promise.resolve(get(head)).then(function(ret) {
          return ret == null ? first2(rest, fallback) : ret;
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var NAME$1 = "config";
    var PUT = "PUT_CONFIG";
    var GET = "GET_CONFIG";
    var GET_ALL = "GET_ALL_CONFIG";
    var UPDATE = "UPDATE_CONFIG";
    var DELETE = "DELETE_CONFIG";
    var CLEAR = "CLEAR_CONFIG";
    var WHERE = "WHERE_CONFIG";
    var UPDATED$2 = "CONFIG/UPDATED";
    var identity = function identity2(v) {
      return v;
    };
    var HANDLERS$2 = (_HANDLERS$2 = {}, _HANDLERS$2[PUT] = function(ctx, _letter, _ref) {
      var key2 = _ref.key, value = _ref.value;
      if (key2 == null)
        throw new Error("Missing 'key' for config/put.");
      ctx.put(key2, value);
      ctx.broadcast(UPDATED$2, _extends$1({}, ctx.all()));
    }, _HANDLERS$2[GET] = function(ctx, letter, _ref2) {
      var key2 = _ref2.key, fallback = _ref2.fallback;
      if (key2 == null)
        throw new Error("Missing 'key' for config/get");
      letter.reply(ctx.get(key2, fallback));
    }, _HANDLERS$2[GET_ALL] = function(ctx, letter) {
      letter.reply(_extends$1({}, ctx.all()));
    }, _HANDLERS$2[UPDATE] = function(ctx, letter, _ref3) {
      var key2 = _ref3.key, fn = _ref3.fn;
      if (key2 == null)
        throw new Error("Missing 'key' for config/update");
      ctx.update(key2, fn || identity);
      ctx.broadcast(UPDATED$2, _extends$1({}, ctx.all()));
    }, _HANDLERS$2[DELETE] = function(ctx, letter, _ref4) {
      var key2 = _ref4.key;
      if (key2 == null)
        throw new Error("Missing 'key' for config/delete");
      ctx["delete"](key2);
      ctx.broadcast(UPDATED$2, _extends$1({}, ctx.all()));
    }, _HANDLERS$2[CLEAR] = function(ctx, letter) {
      var keys = Object.keys(ctx.all());
      for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
        var key2 = _keys[_i];
        ctx["delete"](key2);
      }
      ctx.broadcast(UPDATED$2, _extends$1({}, ctx.all()));
    }, _HANDLERS$2[WHERE] = function(ctx, letter, _ref5) {
      var pattern = _ref5.pattern;
      if (pattern == null)
        throw new Error("Missing 'pattern' for config/where");
      letter.reply(ctx.where(pattern));
    }, _HANDLERS$2[SUBSCRIBE] = function(ctx, letter) {
      ctx.subscribe(letter.from);
      ctx.send(letter.from, UPDATED$2, _extends$1({}, ctx.all()));
    }, _HANDLERS$2[UNSUBSCRIBE] = function(ctx, letter) {
      ctx.unsubscribe(letter.from);
    }, _HANDLERS$2);
    spawn(HANDLERS$2, NAME$1);
    function put(key2, value) {
      _send(NAME$1, PUT, {
        key: key2,
        value
      });
      return config2();
    }
    function get(key2, fallback) {
      return _send(NAME$1, GET, {
        key: key2,
        fallback
      }, {
        expectReply: true,
        timeout: 10
      });
    }
    function all() {
      return _send(NAME$1, GET_ALL, null, {
        expectReply: true,
        timeout: 10
      });
    }
    function update(key2, fn) {
      if (fn === void 0) {
        fn = identity;
      }
      _send(NAME$1, UPDATE, {
        key: key2,
        fn
      });
      return config2();
    }
    function _delete(key2) {
      _send(NAME$1, DELETE, {
        key: key2
      });
      return config2();
    }
    function where(pattern) {
      return _send(NAME$1, WHERE, {
        pattern
      }, {
        expectReply: true,
        timeout: 10
      });
    }
    function subscribe2(callback) {
      return subscriber(NAME$1, function() {
        return spawn(HANDLERS$2, NAME$1);
      }, callback);
    }
    function clearConfig() {
      return _send(NAME$1, CLEAR);
    }
    function config2(values) {
      if (values != null && typeof values === "object") {
        Object.keys(values).map(function(d) {
          return put(d, values[d]);
        });
      }
      return {
        put,
        get,
        all,
        first,
        update,
        "delete": _delete,
        where,
        subscribe: subscribe2,
        overload
      };
    }
    config2.put = put;
    config2.get = get;
    config2.all = all;
    config2.first = first;
    config2.update = update;
    config2["delete"] = _delete;
    config2.where = where;
    config2.subscribe = subscribe2;
    config2.overload = overload;
    var noop4 = function noop5(v) {
      return v;
    };
    function overload(opts, callback) {
      if (opts === void 0) {
        opts = {};
      }
      if (callback === void 0) {
        callback = noop4;
      }
      return new Promise(function(resolve2, reject) {
        try {
          return Promise.resolve(all()).then(function(oldConfig) {
            var _temp = _catch$1(function() {
              config2(opts);
              var _callback = callback;
              return Promise.resolve(all()).then(function(_all) {
                return Promise.resolve(_callback(_all)).then(function(result) {
                  return Promise.resolve(clearConfig()).then(function() {
                    return Promise.resolve(config2(oldConfig)).then(function() {
                      resolve2(result);
                    });
                  });
                });
              });
            }, function(error2) {
              return Promise.resolve(clearConfig()).then(function() {
                return Promise.resolve(config2(oldConfig)).then(function() {
                  reject(error2);
                });
              });
            });
            if (_temp && _temp.then)
              return _temp.then(function() {
              });
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }
    var LEVELS = Object.freeze({
      "debug": 5,
      "info": 4,
      "log": 3,
      "warn": 2,
      "error": 1
    });
    var buildLoggerMessageArgs = function buildLoggerMessageArgs2(_ref) {
      var title = _ref.title, message = _ref.message;
      return ["\n    %c" + title + "\n    ============================\n    " + message + "\n    ============================\n    ", "font-weight:bold;font-family:monospace;"];
    };
    var log = function log2(_ref2) {
      var title = _ref2.title, message = _ref2.message, level = _ref2.level, _ref2$always = _ref2.always, always = _ref2$always === void 0 ? false : _ref2$always;
      try {
        return Promise.resolve(config2.get("logger.level", 0)).then(function(configLoggerLevel) {
          var _console, _console2, _console3, _console4, _console5;
          if (!always && configLoggerLevel < level)
            return;
          var loggerMessageArgs = buildLoggerMessageArgs({
            title,
            message
          });
          switch (level) {
            case LEVELS.debug:
              (_console = console).debug.apply(_console, loggerMessageArgs);
              break;
            case LEVELS.info:
              (_console2 = console).info.apply(_console2, loggerMessageArgs);
              break;
            case LEVELS.warn:
              (_console3 = console).warn.apply(_console3, loggerMessageArgs);
              break;
            case LEVELS.error:
              (_console4 = console).error.apply(_console4, loggerMessageArgs);
              break;
            default:
              (_console5 = console).log.apply(_console5, loggerMessageArgs);
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var deprecate2 = function deprecate3(_ref) {
      var title = _ref.title, message = _ref.message, level = _ref.level, always = _ref.always;
      try {
        return Promise.resolve(log({
          title,
          message,
          level,
          always
        })).then(function() {
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var verifyUserSignatures = function verifyUserSignatures2(message, compSigs) {
      try {
        deprecate2({
          title: "FCL Deprecation Notice",
          message: "\n    fcl.verifyUserSignatures() is deprecated and will be removed in a future release\n    Please use fcl.AppUtils.verifyUserSignatures()",
          level: 2,
          always: true
        });
        return Promise.resolve(verifyUserSignatures$1(message, compSigs));
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var serialize2 = function serialize3(args, opts) {
      if (args === void 0) {
        args = [];
      }
      if (opts === void 0) {
        opts = {};
      }
      try {
        return Promise.resolve(sdk.config.first(["sdk.resolve"], opts.resolve || sdk.resolve)).then(function(resolveFunction) {
          function _temp2() {
            return Promise.resolve(resolveFunction(args)).then(function(_resolveFunction) {
              return JSON.stringify(sdk.createSignableVoucher(_resolveFunction), null, 2);
            });
          }
          var _temp = function() {
            if (Array.isArray(args))
              return Promise.resolve(sdk.pipe(sdk.interaction(), args)).then(function(_pipe) {
                args = _pipe;
              });
          }();
          return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var _HANDLERS$1;
    var RATE = 1e4;
    var UPDATED$1 = "UPDATED";
    var TICK = "TICK";
    var HIGH_WATER_MARK = "hwm";
    var scheduleTick = function scheduleTick2(ctx) {
      try {
        var _setTimeout2 = setTimeout;
        return Promise.resolve(sdk.config().get("fcl.eventPollRate", RATE)).then(function(_config$get) {
          return _setTimeout2(function() {
            return ctx.sendSelf(TICK);
          }, _config$get);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var HANDLERS$1 = (_HANDLERS$1 = {}, _HANDLERS$1[TICK] = function(ctx) {
      try {
        if (!ctx.hasSubs())
          return Promise.resolve();
        var hwm = ctx.get(HIGH_WATER_MARK);
        var _temp2 = function() {
          if (hwm == null) {
            var _put4 = ctx.put;
            return Promise.resolve(sdk.block()).then(function(_block) {
              _put4.call(ctx, HIGH_WATER_MARK, _block);
              var _put2 = ctx.put;
              return Promise.resolve(scheduleTick(ctx)).then(function(_scheduleTick) {
                _put2.call(ctx, TICK, _scheduleTick);
              });
            });
          } else {
            return Promise.resolve(sdk.block()).then(function(next) {
              ctx.put(HIGH_WATER_MARK, next);
              return Promise.resolve(sdk.send([sdk.getEventsAtBlockHeightRange(ctx.self(), hwm.height, next.height - 1)]).then(sdk.decode)).then(function(data) {
                for (var _iterator = _createForOfIteratorHelperLoose$1(data), _step; !(_step = _iterator()).done; ) {
                  var d = _step.value;
                  ctx.broadcast(UPDATED$1, d.data);
                }
                var _put3 = ctx.put;
                return Promise.resolve(scheduleTick(ctx)).then(function(_scheduleTick2) {
                  _put3.call(ctx, TICK, _scheduleTick2);
                });
              });
            });
          }
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function() {
        }) : void 0);
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS$1[utilActor.SUBSCRIBE] = function(ctx, letter) {
      try {
        var _temp5 = function _temp52() {
          ctx.subscribe(letter.from);
        };
        var _temp6 = function() {
          if (!ctx.hasSubs()) {
            var _put6 = ctx.put;
            return Promise.resolve(scheduleTick(ctx)).then(function(_scheduleTick3) {
              _put6.call(ctx, TICK, _scheduleTick3);
            });
          }
        }();
        return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6));
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS$1[utilActor.UNSUBSCRIBE] = function(ctx, letter) {
      ctx.unsubscribe(letter.from);
      if (!ctx.hasSubs()) {
        clearTimeout(ctx.get(TICK));
        ctx["delete"](TICK);
        ctx["delete"](HIGH_WATER_MARK);
      }
    }, _HANDLERS$1);
    var spawnEvents = function spawnEvents2(key2) {
      return utilActor.spawn(HANDLERS$1, key2);
    };
    function events(key2) {
      return {
        subscribe: function subscribe3(callback) {
          return utilActor.subscriber(key2, spawnEvents, callback);
        }
      };
    }
    var addServices = function addServices2(services) {
      if (services === void 0) {
        services = [];
      }
      try {
        return Promise.resolve(config$1.config.get("discovery.authn.endpoint")).then(function(endpoint) {
          utilInvariant.invariant(Boolean(endpoint), '"discovery.authn.endpoint" in config must be defined.');
          return Promise.resolve(config$1.config.get("discovery.authn.include", [])).then(function(include) {
            var url = new URL(endpoint);
            return fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                fclVersion: VERSION,
                include
              })
            }).then(function(d) {
              return d.json();
            }).then(function(json) {
              return [].concat(services, json);
            });
          });
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var asyncPipe = function asyncPipe2() {
      var _arguments = arguments;
      return function(input) {
        return [].slice.call(_arguments).reduce(function(chain, fn) {
          return chain.then(fn);
        }, Promise.resolve(input));
      };
    };
    function addExtensions(services) {
      if (services === void 0) {
        services = [];
      }
      var extensions = window.fcl_extensions || [];
      return [].concat(extensions, services);
    }
    function filterServicesByType(services, type) {
      if (services === void 0) {
        services = [];
      }
      return services.filter(function(service) {
        return service.type === type;
      });
    }
    var getServices = function getServices2(_ref) {
      var type = _ref.type;
      return asyncPipe(addServices, addExtensions, function(s3) {
        return filterServicesByType(s3, type);
      })([]);
    };
    var _HANDLERS;
    var NAME2 = "authn";
    var RESULTS = "results";
    var SNAPSHOT = "SNAPSHOT";
    var UPDATED = "UPDATED";
    var warn = function warn2(fact, msg) {
      if (fact) {
        console.warn("\n      %cFCL Warning\n      ============================\n      " + msg + "\n      For more info, please see the docs: https://docs.onflow.org/fcl/\n      ============================\n      ", "font-weight:bold;font-family:monospace;");
      }
    };
    var HANDLERS = (_HANDLERS = {}, _HANDLERS[utilActor.INIT] = function(ctx) {
      try {
        warn(typeof window === "undefined", '"fcl.discovery" is only available in the browser.');
        return Promise.resolve(getServices({
          type: NAME2
        })).then(function(services) {
          ctx.put(RESULTS, services);
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS[utilActor.SUBSCRIBE] = function(ctx, letter) {
      ctx.subscribe(letter.from);
      ctx.send(letter.from, UPDATED, _extends$2({}, ctx.all()));
    }, _HANDLERS[utilActor.UNSUBSCRIBE] = function(ctx, letter) {
      return ctx.unsubscribe(letter.from);
    }, _HANDLERS[SNAPSHOT] = function(ctx, letter) {
      try {
        return Promise.resolve(letter.reply(_extends$2({}, ctx.all())));
      } catch (e2) {
        return Promise.reject(e2);
      }
    }, _HANDLERS);
    var spawnProviders = function spawnProviders2() {
      return utilActor.spawn(HANDLERS, NAME2);
    };
    var authn = {
      subscribe: function subscribe3(cb) {
        return utilActor.subscriber(NAME2, spawnProviders, cb);
      },
      snapshot: function snapshot2() {
        return utilActor.snapshoter(NAME2, spawnProviders);
      }
    };
    var discovery = {
      authn
    };
    var authenticate = function authenticate2(opts) {
      if (opts === void 0) {
        opts = {};
      }
      return currentUser().authenticate(opts);
    };
    var unauthenticate = function unauthenticate2() {
      return currentUser().unauthenticate();
    };
    var reauthenticate = function reauthenticate2(opts) {
      if (opts === void 0) {
        opts = {};
      }
      currentUser().unauthenticate();
      return currentUser().authenticate(opts);
    };
    var signUp = function signUp2(opts) {
      if (opts === void 0) {
        opts = {};
      }
      return currentUser().authenticate(opts);
    };
    var logIn = function logIn2(opts) {
      if (opts === void 0) {
        opts = {};
      }
      return currentUser().authenticate(opts);
    };
    var authz = currentUser().authorization;
    var t2 = t__namespace;
    Object.defineProperty(exports, "config", {
      enumerable: true,
      get: function() {
        return config$1.config;
      }
    });
    Object.defineProperty(exports, "TestUtils", {
      enumerable: true,
      get: function() {
        return sdk.TestUtils;
      }
    });
    Object.defineProperty(exports, "account", {
      enumerable: true,
      get: function() {
        return sdk.account;
      }
    });
    Object.defineProperty(exports, "arg", {
      enumerable: true,
      get: function() {
        return sdk.arg;
      }
    });
    Object.defineProperty(exports, "args", {
      enumerable: true,
      get: function() {
        return sdk.args;
      }
    });
    Object.defineProperty(exports, "atBlockHeight", {
      enumerable: true,
      get: function() {
        return sdk.atBlockHeight;
      }
    });
    Object.defineProperty(exports, "atBlockId", {
      enumerable: true,
      get: function() {
        return sdk.atBlockId;
      }
    });
    Object.defineProperty(exports, "authorization", {
      enumerable: true,
      get: function() {
        return sdk.authorization;
      }
    });
    Object.defineProperty(exports, "authorizations", {
      enumerable: true,
      get: function() {
        return sdk.authorizations;
      }
    });
    Object.defineProperty(exports, "block", {
      enumerable: true,
      get: function() {
        return sdk.block;
      }
    });
    Object.defineProperty(exports, "build", {
      enumerable: true,
      get: function() {
        return sdk.build;
      }
    });
    Object.defineProperty(exports, "createSignableVoucher", {
      enumerable: true,
      get: function() {
        return sdk.createSignableVoucher;
      }
    });
    Object.defineProperty(exports, "decode", {
      enumerable: true,
      get: function() {
        return sdk.decode;
      }
    });
    Object.defineProperty(exports, "getAccount", {
      enumerable: true,
      get: function() {
        return sdk.getAccount;
      }
    });
    Object.defineProperty(exports, "getBlock", {
      enumerable: true,
      get: function() {
        return sdk.getBlock;
      }
    });
    Object.defineProperty(exports, "getBlockHeader", {
      enumerable: true,
      get: function() {
        return sdk.getBlockHeader;
      }
    });
    Object.defineProperty(exports, "getCollection", {
      enumerable: true,
      get: function() {
        return sdk.getCollection;
      }
    });
    Object.defineProperty(exports, "getEvents", {
      enumerable: true,
      get: function() {
        return sdk.getEvents;
      }
    });
    Object.defineProperty(exports, "getEventsAtBlockHeightRange", {
      enumerable: true,
      get: function() {
        return sdk.getEventsAtBlockHeightRange;
      }
    });
    Object.defineProperty(exports, "getEventsAtBlockIds", {
      enumerable: true,
      get: function() {
        return sdk.getEventsAtBlockIds;
      }
    });
    Object.defineProperty(exports, "getTransaction", {
      enumerable: true,
      get: function() {
        return sdk.getTransaction;
      }
    });
    Object.defineProperty(exports, "getTransactionStatus", {
      enumerable: true,
      get: function() {
        return sdk.getTransactionStatus;
      }
    });
    Object.defineProperty(exports, "invariant", {
      enumerable: true,
      get: function() {
        return sdk.invariant;
      }
    });
    Object.defineProperty(exports, "isBad", {
      enumerable: true,
      get: function() {
        return sdk.isBad;
      }
    });
    Object.defineProperty(exports, "isOk", {
      enumerable: true,
      get: function() {
        return sdk.isOk;
      }
    });
    Object.defineProperty(exports, "limit", {
      enumerable: true,
      get: function() {
        return sdk.limit;
      }
    });
    Object.defineProperty(exports, "param", {
      enumerable: true,
      get: function() {
        return sdk.param;
      }
    });
    Object.defineProperty(exports, "params", {
      enumerable: true,
      get: function() {
        return sdk.params;
      }
    });
    Object.defineProperty(exports, "payer", {
      enumerable: true,
      get: function() {
        return sdk.payer;
      }
    });
    Object.defineProperty(exports, "ping", {
      enumerable: true,
      get: function() {
        return sdk.ping;
      }
    });
    Object.defineProperty(exports, "pipe", {
      enumerable: true,
      get: function() {
        return sdk.pipe;
      }
    });
    Object.defineProperty(exports, "proposer", {
      enumerable: true,
      get: function() {
        return sdk.proposer;
      }
    });
    Object.defineProperty(exports, "ref", {
      enumerable: true,
      get: function() {
        return sdk.ref;
      }
    });
    Object.defineProperty(exports, "script", {
      enumerable: true,
      get: function() {
        return sdk.script;
      }
    });
    Object.defineProperty(exports, "send", {
      enumerable: true,
      get: function() {
        return sdk.send;
      }
    });
    Object.defineProperty(exports, "transaction", {
      enumerable: true,
      get: function() {
        return sdk.transaction;
      }
    });
    Object.defineProperty(exports, "validator", {
      enumerable: true,
      get: function() {
        return sdk.validator;
      }
    });
    Object.defineProperty(exports, "voucherIntercept", {
      enumerable: true,
      get: function() {
        return sdk.voucherIntercept;
      }
    });
    Object.defineProperty(exports, "voucherToTxId", {
      enumerable: true,
      get: function() {
        return sdk.voucherToTxId;
      }
    });
    Object.defineProperty(exports, "why", {
      enumerable: true,
      get: function() {
        return sdk.why;
      }
    });
    Object.defineProperty(exports, "display", {
      enumerable: true,
      get: function() {
        return utilAddress.display;
      }
    });
    Object.defineProperty(exports, "sansPrefix", {
      enumerable: true,
      get: function() {
        return utilAddress.sansPrefix;
      }
    });
    Object.defineProperty(exports, "withPrefix", {
      enumerable: true,
      get: function() {
        return utilAddress.withPrefix;
      }
    });
    Object.defineProperty(exports, "cadence", {
      enumerable: true,
      get: function() {
        return utilTemplate.template;
      }
    });
    Object.defineProperty(exports, "cdc", {
      enumerable: true,
      get: function() {
        return utilTemplate.template;
      }
    });
    exports.AppUtils = index5;
    exports.VERSION = VERSION;
    exports.WalletUtils = index$1;
    exports.authenticate = authenticate;
    exports.authz = authz;
    exports.currentUser = currentUser;
    exports.discovery = discovery;
    exports.events = events;
    exports.logIn = logIn;
    exports.mutate = mutate;
    exports.query = query;
    exports.reauthenticate = reauthenticate;
    exports.serialize = serialize2;
    exports.signUp = signUp;
    exports.t = t2;
    exports.tx = transaction;
    exports.unauthenticate = unauthenticate;
    exports.verifyUserSignatures = verifyUserSignatures;
  }
});

// .svelte-kit/output/server/entries/pages/index.svelte.js
var index_svelte_exports = {};
__export(index_svelte_exports, {
  default: () => Routes
});
function writable2(value, start = noop2) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue2.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue2.length; i2 += 2) {
            subscriber_queue2[i2][0](subscriber_queue2[i2 + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var import_fcl, import_config, subscriber_queue2, user, profile, transactionStatus, transactionInProgress, txId, css$1, UserAddress, Profile, Auth, css4, Transaction, Routes;
var init_index_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/index.svelte.js"() {
    init_shims();
    init_index_cdce086c();
    import_fcl = __toESM(require_fcl(), 1);
    import_config = __toESM(require_config(), 1);
    subscriber_queue2 = [];
    user = writable2(null);
    profile = writable2(null);
    transactionStatus = writable2(null);
    transactionInProgress = writable2(false);
    txId = writable2(false);
    (0, import_config.config)({
      "app.detail.title": "FCL Quickstart for SvelteKit",
      "app.detail.icon": "https://unavatar.io/twitter/muttonia",
      "accessNode.api": "https://rest-testnet.onflow.org",
      "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
      "0xProfile": "0xba1132bc08f82fe2"
    });
    css$1 = {
      code: ".led-green.svelte-bnzski{position:relative;display:inline-block;top:0px;margin-right:0.5em;background-color:var(--primary);width:14px;height:14px;border-radius:14px}",
      map: null
    };
    UserAddress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $user, $$unsubscribe_user;
      $$unsubscribe_user = subscribe(user, (value) => $user = value);
      $$result.css.add(css$1);
      $$unsubscribe_user();
      return `<div class="${"mb-1"}">${($user == null ? void 0 : $user.addr) ? `<span class="${"led-green svelte-bnzski"}"></span>` : ``}
  <span class="${"mono"}">${escape(($user == null ? void 0 : $user.addr) ?? "No Address")}</span></div>`;
    });
    Profile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $profile, $$unsubscribe_profile;
      $$unsubscribe_profile = subscribe(profile, (value) => $profile = value);
      $$unsubscribe_profile();
      return `<article class="${"card"}"><label for="${"address"}">Address
    <input type="${"text"}" id="${"address"}" name="${"address"}"${add_attribute("value", $profile.address, 0)} placeholder="${"Address"}" disabled></label>
  <div class="${"grid"}"><label for="${"name"}">Name
      <input type="${"text"}" id="${"name"}" name="${"name"}" placeholder="${"Name"}"${add_attribute("value", $profile.name, 0)}></label>
    
    <label for="${"color"}">Favorite Color
      <input type="${"color"}" id="${"color"}" name="${"color"}"${add_attribute("value", $profile.color, 0)}></label></div>
  
  <label for="${"info"}">Bio</label>
  <textarea type="${"info"}" id="${"info"}" name="${"info"}" placeholder="${"Your personal info"}">${$profile.info || ""}</textarea>

  <button>Update Profile</button></article>`;
    });
    Auth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $user, $$unsubscribe_user;
      let $profile, $$unsubscribe_profile;
      $$unsubscribe_user = subscribe(user, (value) => $user = value);
      $$unsubscribe_profile = subscribe(profile, (value) => $profile = value);
      $$unsubscribe_user();
      $$unsubscribe_profile();
      return `<div class="${"grid"}"><div class="${"mb-2"}">${($user == null ? void 0 : $user.loggedIn) && $profile ? `${validate_component(Profile, "Profile").$$render($$result, {}, {}, {})}` : `<h1>Welcome to web3!
    </h1>
    <p>This is a starter app built on Flow. It demonstrates how to use the Flow Client Library (FCL) with SvelteKit.</p>
    ${!($user == null ? void 0 : $user.loggedIn) ? `<p>Login to get started.</p>` : `<p>Create a profile and then click on Load Profile to see it here.</p>`}`}</div>
  <div>${($user == null ? void 0 : $user.loggedIn) ? `<div><div>You are now logged in as: ${validate_component(UserAddress, "UserAddress").$$render($$result, {}, {}, {})}<button>Log Out</button></div>
      <h2>Controls</h2>
      <button>Create Profile</button>
      <button>Load Profile</button></div>` : `<div><button>Log In</button>
      <button>Sign Up</button></div>`}</div></div>`;
    });
    css4 = {
      code: "article.svelte-aszgh2{padding:1rem;margin:0;position:fixed;left:10px;bottom:10px;font-size:0.7rem}span.svelte-aszgh2{font-size:0.7rem}progress.svelte-aszgh2{margin-top:0.5rem;margin-bottom:0}small.svelte-aszgh2{opacity:0.8}.txId.svelte-aszgh2{margin-left:10px}@media screen and (max-width: 600px){article.svelte-aszgh2{right:10px}}",
      map: null
    };
    Transaction = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $transactionInProgress, $$unsubscribe_transactionInProgress;
      let $transactionStatus, $$unsubscribe_transactionStatus;
      let $txId, $$unsubscribe_txId;
      $$unsubscribe_transactionInProgress = subscribe(transactionInProgress, (value) => $transactionInProgress = value);
      $$unsubscribe_transactionStatus = subscribe(transactionStatus, (value) => $transactionStatus = value);
      $$unsubscribe_txId = subscribe(txId, (value) => $txId = value);
      $$result.css.add(css4);
      $$unsubscribe_transactionInProgress();
      $$unsubscribe_transactionStatus();
      $$unsubscribe_txId();
      return `${$transactionInProgress ? `<article class="${"accent-border " + escape($transactionStatus == 99 ? "error" : null) + " svelte-aszgh2"}">${$transactionStatus < 0 ? `<span class="${"svelte-aszgh2"}"><kbd>Initializing</kbd><br>
        <small class="${"svelte-aszgh2"}">Waiting for transaction approval.</small></span>
      <progress indeterminate class="${"svelte-aszgh2"}">Initializing...</progress>` : `${$transactionStatus < 2 ? `<span class="${"svelte-aszgh2"}"><kbd>Pending</kbd>
        <span class="${"txId svelte-aszgh2"}"><a${add_attribute("href", `https://testnet.flowscan.org/transaction/${$txId}`, 0)} target="${"_blank"}">${escape($txId == null ? void 0 : $txId.slice(0, 8))}...
          </a>
        </span><br>
        <small class="${"svelte-aszgh2"}">The transaction has been received by a collector but not yet finalized
          in a block.
        </small></span>
      <progress indeterminate class="${"svelte-aszgh2"}">Finalizing...</progress>` : `${$transactionStatus === 2 ? `<span class="${"svelte-aszgh2"}"><kbd>Finalized</kbd>
        <span class="${"txId svelte-aszgh2"}"><a${add_attribute("href", `https://testnet.flowscan.org/transaction/${$txId}`, 0)} target="${"_blank"}">${escape($txId == null ? void 0 : $txId.slice(0, 8))}...
          </a>
        </span><br>
        <small class="${"svelte-aszgh2"}">The consensus nodes have finalized the block that the transaction is included in.</small></span>
      <progress min="${"0"}" max="${"100"}" value="${"60"}" class="${"svelte-aszgh2"}">Executing...</progress>` : `${$transactionStatus === 3 ? `<span class="${"svelte-aszgh2"}"><kbd>Executed</kbd>
      <span class="${"txId svelte-aszgh2"}"><a${add_attribute("href", `https://testnet.flowscan.org/transaction/${$txId}`, 0)} target="${"_blank"}">${escape($txId == null ? void 0 : $txId.slice(0, 8))}...
        </a>
      </span><br>
      <small class="${"svelte-aszgh2"}">The execution nodes have produced a result for the transaction.
      </small></span>
      <progress min="${"0"}" max="${"100"}" value="${"80"}" class="${"svelte-aszgh2"}">Sealing...</progress>` : `${$transactionStatus === 4 ? `<span class="${"svelte-aszgh2"}"><kbd>\u2713 Sealed</kbd>
      <span class="${"txId svelte-aszgh2"}"><a${add_attribute("href", `https://testnet.flowscan.org/transaction/${$txId}`, 0)} target="${"_blank"}">${escape($txId == null ? void 0 : $txId.slice(0, 8))}...
        </a>
      </span><br>
      <small class="${"svelte-aszgh2"}">The verification nodes have verified the transaction, and the seal is included in the latest block.</small></span>
      <progress min="${"0"}" max="${"100"}" value="${"100"}" class="${"svelte-aszgh2"}">Sealed!</progress>` : `${$transactionStatus === 5 ? `<span class="${"svelte-aszgh2"}"><kbd>Expired</kbd>
      <span class="${"txId svelte-aszgh2"}"><a${add_attribute("href", `https://testnet.flowscan.org/transaction/${$txId}`, 0)} target="${"_blank"}">${escape($txId == null ? void 0 : $txId.slice(0, 8))}...
        </a>
      </span><br>
      <small class="${"svelte-aszgh2"}">The transaction was submitted past its expiration block height.</small></span>` : `<span data-theme="${"invalid"}" class="${"svelte-aszgh2"}">Unexpected parameters were passed into the transaction.
      </span>`}`}`}`}`}`}
    <small class="${"svelte-aszgh2"}"><a href="${"https://docs.onflow.org/access-api/"}">More info</a></small></article>` : ``}`;
    });
    Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `${$$result.title = `<title>Home</title>`, ""}`, ""}

<div class="${"mb-2"}">${validate_component(Transaction, "Transaction").$$render($$result, {}, {}, {})}</div>

${validate_component(Auth, "Auth").$$render($$result, {}, {}, {})}`;
    });
  }
});

// .svelte-kit/output/server/nodes/3.js
var __exports3 = {};
__export(__exports3, {
  css: () => css5,
  entry: () => entry3,
  index: () => index3,
  js: () => js3,
  module: () => index_svelte_exports
});
var index3, entry3, js3, css5;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/3.js"() {
    init_shims();
    init_index_svelte();
    index3 = 3;
    entry3 = "pages/index.svelte-1f8685bb.js";
    js3 = ["pages/index.svelte-1f8685bb.js", "chunks/index-433ca775.js", "chunks/index-8062e47b.js"];
    css5 = ["assets/pages/index.svelte-31869105.css"];
  }
});

// .svelte-kit/output/server/entries/pages/about.svelte.js
var about_svelte_exports = {};
__export(about_svelte_exports, {
  default: () => About
});
var About;
var init_about_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/about.svelte.js"() {
    init_shims();
    init_index_cdce086c();
    About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `${$$result.title = `<title>About</title>`, ""}`, ""}

<div class="${"container"}"><h1>About this app</h1>

	<p>This is a <a href="${"https://docs.onflow.org/fcl"}">FCL-powered</a> app built on <a href="${"http://onflow.org"}">Flow</a>.
	</p>

  <p>This app shows how to:
  </p>
  <ul><li>Authenticate a user on the Flow blockchain.</li>
    <li>Import a contract to let a user create a profile and query the blockchain for their data.</li>
    <li>Let a user modify their profile and mutate the blockchain to save changes.</li></ul>

  <p>Use this app as a starting template to build your very own web3 app, powered on Flow! Flow is a fast, decentralized, and developer-friendly blockchain, designed as the foundation for a new generation of games, apps, and the digital assets that power them. It is based on a unique, multi-role architecture, and designed to scale without sharding, allowing for massive improvements in speed and throughput while preserving a developer-friendly, ACID-compliant environment.</p></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports4 = {};
__export(__exports4, {
  css: () => css6,
  entry: () => entry4,
  index: () => index4,
  js: () => js4,
  module: () => about_svelte_exports
});
var index4, entry4, js4, css6;
var init__4 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    init_shims();
    init_about_svelte();
    index4 = 2;
    entry4 = "pages/about.svelte-1dfac852.js";
    js4 = ["pages/about.svelte-1dfac852.js", "chunks/index-433ca775.js"];
    css6 = [];
  }
});

// .svelte-kit/firebase/entry.js
var entry_exports = {};
__export(entry_exports, {
  default: () => svelteKit
});
module.exports = __toCommonJS(entry_exports);
init_shims();

// .svelte-kit/output/server/index.js
init_shims();
init_index_cdce086c();
var __defProp2 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp2(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function afterUpdate() {
}
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  {
    stores.page.set(page2);
  }
  return `


${components[1] ? `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => {
      return `${components[2] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
        default: () => {
          return `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`;
        }
      })}` : `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
    }
  })}` : `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
});
function to_headers(object) {
  const headers = new Headers();
  if (object) {
    for (const key2 in object) {
      const value = object[key2];
      if (!value)
        continue;
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          headers.append(key2, value2);
        });
      } else {
        headers.set(key2, value);
      }
    }
  }
  return headers;
}
function hash(value) {
  let hash2 = 5381;
  let i2 = value.length;
  if (typeof value === "string") {
    while (i2)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i2);
  } else {
    while (i2)
      hash2 = hash2 * 33 ^ value[--i2];
  }
  return (hash2 >>> 0).toString(36);
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key2 in obj) {
    clone2[key2.toLowerCase()] = obj[key2];
  }
  return clone2;
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = params[key2].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
  }
  return params;
}
function is_pojo(body) {
  if (typeof body !== "object")
    return false;
  if (body) {
    if (body instanceof Uint8Array)
      return false;
    if (body._readableState && typeof body.pipe === "function")
      return false;
    if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
      return false;
  }
  return true;
}
function normalize_request_method(event) {
  const method = event.request.method.toLowerCase();
  return method === "delete" ? "del" : method;
}
function error(body) {
  return new Response(body, {
    status: 500
  });
}
function is_string(s22) {
  return typeof s22 === "string" || s22 instanceof String;
}
var text_types = /* @__PURE__ */ new Set([
  "application/xml",
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data"
]);
function is_text(content_type) {
  if (!content_type)
    return true;
  const type = content_type.split(";")[0].toLowerCase();
  return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
}
async function render_endpoint(event, mod) {
  const method = normalize_request_method(event);
  let handler = mod[method];
  if (!handler && method === "head") {
    handler = mod.get;
  }
  if (!handler) {
    const allowed = [];
    for (const method2 in ["get", "post", "put", "patch"]) {
      if (mod[method2])
        allowed.push(method2.toUpperCase());
    }
    if (mod.del)
      allowed.push("DELETE");
    if (mod.get || mod.head)
      allowed.push("HEAD");
    return event.request.headers.get("x-sveltekit-load") ? new Response(void 0, {
      status: 204
    }) : new Response(`${event.request.method} method not allowed`, {
      status: 405,
      headers: {
        allow: allowed.join(", ")
      }
    });
  }
  const response = await handler(event);
  const preface = `Invalid response from route ${event.url.pathname}`;
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  if (response.fallthrough) {
    throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
  }
  const { status = 200, body = {} } = response;
  const headers = response.headers instanceof Headers ? new Headers(response.headers) : to_headers(response.headers);
  const type = headers.get("content-type");
  if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
    headers.set("content-type", "application/json; charset=utf-8");
    normalized_body = JSON.stringify(body);
  } else {
    normalized_body = body;
  }
  if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
    const cache_control = headers.get("cache-control");
    if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
      headers.set("etag", `"${hash(normalized_body)}"`);
    }
  }
  return new Response(method !== "head" ? normalized_body : void 0, {
    status,
    headers
  });
}
var chars$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key2) {
            return walk(thing[key2]);
          });
      }
    }
  }
  walk(value);
  var names = /* @__PURE__ */ new Map();
  Array.from(counts).filter(function(entry5) {
    return entry5[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry5, i2) {
    names.set(entry5[0], getName(i2));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i2) {
          return i2 in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key2) {
          return safeKey(key2) + ":" + stringify(thing[key2]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i2) {
            statements_1.push(name + "[" + i2 + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key2) {
            statements_1.push("" + name + safeProp(key2) + "=" + stringify(thing[key2]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars$1[num % chars$1.length] + name;
    num = ~~(num / chars$1.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped2[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escapeUnsafeChars(JSON.stringify(key2));
}
function safeProp(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? "." + key2 : "[" + escapeUnsafeChars(JSON.stringify(key2)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i2 = 0; i2 < str.length; i2 += 1) {
    var char = str.charAt(i2);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped2) {
      result += escaped2[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i2 + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i2];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop3() {
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop3) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop3) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop3;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
var render_json_payload_script_dict = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var render_json_payload_script_regex = new RegExp(`[${Object.keys(render_json_payload_script_dict).join("")}]`, "g");
function render_json_payload_script(attrs, payload) {
  const safe_payload = JSON.stringify(payload).replace(render_json_payload_script_regex, (match) => render_json_payload_script_dict[match]);
  let safe_attrs = "";
  for (const [key2, value] of Object.entries(attrs)) {
    if (value === void 0)
      continue;
    safe_attrs += ` sveltekit:data-${key2}=${escape_html_attr(value)}`;
  }
  return `<script type="application/json"${safe_attrs}>${safe_payload}<\/script>`;
}
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
};
var escape_html_attr_regex = new RegExp(`[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
function escape_html_attr(str) {
  const escaped_str = str.replace(escape_html_attr_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return `"${escaped_str}"`;
}
var s2 = JSON.stringify;
function create_prerendering_url_proxy(url) {
  return new Proxy(url, {
    get: (target, prop, receiver) => {
      if (prop === "search" || prop === "searchParams") {
        throw new Error(`Cannot access url.${prop} on a page with prerendering enabled`);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
var encoder = new TextEncoder();
function sha256(data) {
  if (!key[0])
    precompute();
  const out = init.slice(0);
  const array2 = encode$1(data);
  for (let i2 = 0; i2 < array2.length; i2 += 16) {
    const w = array2.subarray(i2, i2 + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i22 = 0; i22 < 64; i22++) {
      if (i22 < 16) {
        tmp = w[i22];
      } else {
        a = w[i22 + 1 & 15];
        b = w[i22 + 14 & 15];
        tmp = w[i22 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i22 & 15] + w[i22 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i22];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x2) {
    return (x2 - Math.floor(x2)) * 4294967296;
  }
  let prime = 2;
  for (let i2 = 0; i2 < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i2 < 8) {
        init[i2] = frac(prime ** (1 / 2));
      }
      key[i2] = frac(prime ** (1 / 3));
      i2++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i2 = 0; i2 < bytes.length; i2 += 4) {
    const a = bytes[i2 + 0];
    const b = bytes[i2 + 1];
    const c = bytes[i2 + 2];
    const d = bytes[i2 + 3];
    bytes[i2 + 0] = d;
    bytes[i2 + 1] = c;
    bytes[i2 + 2] = b;
    bytes[i2 + 3] = a;
  }
}
function encode$1(str) {
  const encoded = encoder.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i2;
  for (i2 = 2; i2 < l; i2 += 3) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2 | bytes[i2] >> 6];
    result += chars[bytes[i2] & 63];
  }
  if (i2 === l + 1) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4];
    result += "==";
  }
  if (i2 === l) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
var csp_ready;
var array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return base64(array);
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var Csp = class {
  #use_hashes;
  #dev;
  #script_needs_csp;
  #style_needs_csp;
  #directives;
  #script_src;
  #style_src;
  constructor({ mode, directives }, { dev, prerender, needs_nonce }) {
    this.#use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.#directives = dev ? __spreadValues({}, directives) : directives;
    this.#dev = dev;
    const d = this.#directives;
    if (dev) {
      const effective_style_src2 = d["style-src"] || d["default-src"];
      if (effective_style_src2 && !effective_style_src2.includes("unsafe-inline")) {
        d["style-src"] = [...effective_style_src2, "unsafe-inline"];
      }
    }
    this.#script_src = [];
    this.#style_src = [];
    const effective_script_src = d["script-src"] || d["default-src"];
    const effective_style_src = d["style-src"] || d["default-src"];
    this.#script_needs_csp = !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0;
    this.#style_needs_csp = !dev && !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0;
    this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
    this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
    if (this.script_needs_nonce || this.style_needs_nonce || needs_nonce) {
      this.nonce = generate_nonce();
    }
  }
  add_script(content) {
    if (this.#script_needs_csp) {
      if (this.#use_hashes) {
        this.#script_src.push(`sha256-${sha256(content)}`);
      } else if (this.#script_src.length === 0) {
        this.#script_src.push(`nonce-${this.nonce}`);
      }
    }
  }
  add_style(content) {
    if (this.#style_needs_csp) {
      if (this.#use_hashes) {
        this.#style_src.push(`sha256-${sha256(content)}`);
      } else if (this.#style_src.length === 0) {
        this.#style_src.push(`nonce-${this.nonce}`);
      }
    }
  }
  get_header(is_meta = false) {
    const header = [];
    const directives = __spreadValues({}, this.#directives);
    if (this.#style_src.length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...this.#style_src
      ];
    }
    if (this.#script_src.length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...this.#script_src
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = directives[key2];
      if (!value)
        continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
  get_meta() {
    const content = escape_html_attr(this.get_header(true));
    return `<meta http-equiv="content-security-policy" content=${content}>`;
  }
};
var updated = __spreadProps(__spreadValues({}, readable(false)), {
  check: () => false
});
async function render_response({
  branch,
  options,
  state,
  $session,
  page_config,
  status,
  error: error2 = null,
  event,
  resolve_opts,
  stuff
}) {
  if (state.prerendering) {
    if (options.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options.template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const stylesheets = new Set(options.manifest._.entry.css);
  const modulepreloads = new Set(options.manifest._.entry.js);
  const styles = /* @__PURE__ */ new Map();
  const serialized_data = [];
  let shadow_props;
  let rendered;
  let is_private = false;
  let cache;
  if (error2) {
    error2.stack = options.get_stack(error2);
  }
  if (resolve_opts.ssr) {
    branch.forEach(({ node, props: props2, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => stylesheets.add(url));
      if (node.js)
        node.js.forEach((url) => modulepreloads.add(url));
      if (node.styles)
        Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (props2)
        shadow_props = props2;
      cache = loaded == null ? void 0 : loaded.cache;
      is_private = (cache == null ? void 0 : cache.private) ?? uses_credentials;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session: __spreadProps(__spreadValues({}, session), {
          subscribe: (fn) => {
            is_private = (cache == null ? void 0 : cache.private) ?? true;
            return session.subscribe(fn);
          }
        }),
        updated
      },
      page: {
        error: error2,
        params: event.params,
        routeId: event.routeId,
        status,
        stuff,
        url: state.prerendering ? create_prerendering_url_proxy(event.url) : event.url
      },
      components: branch.map(({ node }) => node.module.default)
    };
    const print_error = (property, replacement) => {
      Object.defineProperty(props.page, property, {
        get: () => {
          throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
        }
      });
    };
    print_error("origin", "origin");
    print_error("path", "pathname");
    print_error("query", "searchParams");
    for (let i2 = 0; i2 < branch.length; i2 += 1) {
      props[`props_${i2}`] = await branch[i2].loaded.props;
    }
    rendered = options.root.render(props);
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let { head, html: body } = rendered;
  const inlined_style = Array.from(styles.values()).join("\n");
  await csp_ready;
  const csp = new Csp(options.csp, {
    dev: options.dev,
    prerender: !!state.prerendering,
    needs_nonce: options.template_contains_nonce
  });
  const target = hash(body);
  const init_app = `
		import { start } from ${s2(options.prefix + options.manifest._.entry.file)};
		start({
			target: document.querySelector('[data-sveltekit-hydrate="${target}"]').parentNode,
			paths: ${s2(options.paths)},
			session: ${try_serialize($session, (error3) => {
    throw new Error(`Failed to serialize session data: ${error3.message}`);
  })},
			route: ${!!page_config.router},
			spa: ${!resolve_opts.ssr},
			trailing_slash: ${s2(options.trailing_slash)},
			hydrate: ${resolve_opts.ssr && page_config.hydrate ? `{
				status: ${status},
				error: ${serialize_error(error2)},
				nodes: [${branch.map(({ node }) => node.index).join(", ")}],
				params: ${devalue(event.params)},
				routeId: ${s2(event.routeId)}
			}` : "null"}
		});
	`;
  const init_service_worker = `
		if ('serviceWorker' in navigator) {
			addEventListener('load', () => {
				navigator.serviceWorker.register('${options.service_worker}');
			});
		}
	`;
  if (inlined_style) {
    const attributes = [];
    if (options.dev)
      attributes.push(" data-sveltekit");
    if (csp.style_needs_nonce)
      attributes.push(` nonce="${csp.nonce}"`);
    csp.add_style(inlined_style);
    head += `
	<style${attributes.join("")}>${inlined_style}</style>`;
  }
  head += Array.from(stylesheets).map((dep) => {
    const attributes = [
      'rel="stylesheet"',
      `href="${options.prefix + dep}"`
    ];
    if (csp.style_needs_nonce) {
      attributes.push(`nonce="${csp.nonce}"`);
    }
    if (styles.has(dep)) {
      attributes.push("disabled", 'media="(max-width: 0)"');
    }
    return `
	<link ${attributes.join(" ")}>`;
  }).join("");
  if (page_config.router || page_config.hydrate) {
    head += Array.from(modulepreloads).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
    const attributes = ['type="module"', `data-sveltekit-hydrate="${target}"`];
    csp.add_script(init_app);
    if (csp.script_needs_nonce) {
      attributes.push(`nonce="${csp.nonce}"`);
    }
    body += `
		<script ${attributes.join(" ")}>${init_app}<\/script>`;
    body += serialized_data.map(({ url, body: body2, response }) => render_json_payload_script({ type: "data", url, body: typeof body2 === "string" ? hash(body2) : void 0 }, response)).join("\n	");
    if (shadow_props) {
      body += render_json_payload_script({ type: "props" }, shadow_props);
    }
  }
  if (options.service_worker) {
    csp.add_script(init_service_worker);
    head += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_service_worker}<\/script>`;
  }
  if (state.prerendering) {
    const http_equiv = [];
    const csp_headers = csp.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (cache) {
      http_equiv.push(`<meta http-equiv="cache-control" content="max-age=${cache.maxage}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  }
  const segments = event.url.pathname.slice(options.paths.base.length).split("/").slice(2);
  const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
  const html = await resolve_opts.transformPage({
    html: options.template({ head, body, assets: assets2, nonce: csp.nonce })
  });
  const headers = new Headers({
    "content-type": "text/html",
    etag: `"${hash(html)}"`
  });
  if (cache) {
    headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${cache.maxage}`);
  }
  if (!options.floc) {
    headers.set("permissions-policy", "interest-cohort=()");
  }
  if (!state.prerendering) {
    const csp_header = csp.get_header();
    if (csp_header) {
      headers.set("content-security-policy", csp_header);
    }
  }
  return new Response(html, {
    status,
    headers
  });
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize(__spreadProps(__spreadValues({}, error2), { name, message, stack }));
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
var parse_1 = parse$1;
var serialize_1 = serialize;
var __toString = Object.prototype.toString;
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  var obj = {};
  var opt = options || {};
  var dec = opt.decode || decode;
  var index5 = 0;
  while (index5 < str.length) {
    var eqIdx = str.indexOf("=", index5);
    if (eqIdx === -1) {
      break;
    }
    var endIdx = str.indexOf(";", index5);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index5 = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    var key2 = str.slice(index5, eqIdx).trim();
    if (obj[key2] === void 0) {
      var val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key2] = tryDecode(val, dec);
    }
    index5 = endIdx + 1;
  }
  return obj;
}
function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  var value = enc(val);
  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError("argument val is invalid");
  }
  var str = name + "=" + value;
  if (opt.maxAge != null) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    var expires = opt.expires;
    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function decode(str) {
  return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
}
function encode(val) {
  return encodeURIComponent(val);
}
function isDate(val) {
  return __toString.call(val) === "[object Date]" || val instanceof Date;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e2) {
    return str;
  }
}
var setCookie = { exports: {} };
var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false
};
function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValue = parts.shift().split("=");
  var name = nameValue.shift();
  var value = nameValue.join("=");
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  try {
    value = options.decodeValues ? decodeURIComponent(value) : value;
  } catch (e2) {
    console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e2);
  }
  var cookie = {
    name,
    value
  };
  parts.forEach(function(part) {
    var sides = part.split("=");
    var key2 = sides.shift().trimLeft().toLowerCase();
    var value2 = sides.join("=");
    if (key2 === "expires") {
      cookie.expires = new Date(value2);
    } else if (key2 === "max-age") {
      cookie.maxAge = parseInt(value2, 10);
    } else if (key2 === "secure") {
      cookie.secure = true;
    } else if (key2 === "httponly") {
      cookie.httpOnly = true;
    } else if (key2 === "samesite") {
      cookie.sameSite = value2;
    } else {
      cookie[key2] = value2;
    }
  });
  return cookie;
}
function parse(input, options) {
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  if (!input) {
    if (!options.map) {
      return [];
    } else {
      return {};
    }
  }
  if (input.headers && input.headers["set-cookie"]) {
    input = input.headers["set-cookie"];
  } else if (input.headers) {
    var sch = input.headers[Object.keys(input.headers).find(function(key2) {
      return key2.toLowerCase() === "set-cookie";
    })];
    if (!sch && input.headers.cookie && !options.silent) {
      console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
    }
    input = sch;
  }
  if (!Array.isArray(input)) {
    input = [input];
  }
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  if (!options.map) {
    return input.filter(isNonEmptyString).map(function(str) {
      return parseString(str, options);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
      var cookie = parseString(str, options);
      cookies2[cookie.name] = cookie;
      return cookies2;
    }, cookies);
  }
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
setCookie.exports = parse;
setCookie.exports.parse = parse;
var parseString_1 = setCookie.exports.parseString = parseString;
var splitCookiesString_1 = setCookie.exports.splitCookiesString = splitCookiesString;
function normalize(loaded) {
  if (loaded.fallthrough) {
    throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
  }
  if ("maxage" in loaded) {
    throw new Error("maxage should be replaced with cache: { maxage }");
  }
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return { status: status || 500, error: new Error() };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      throw new Error('"redirect" property returned from load() must be accompanied by a 3xx status code');
    }
    if (typeof loaded.redirect !== "string") {
      throw new Error('"redirect" property returned from load() must be a string');
    }
  }
  if (loaded.dependencies) {
    if (!Array.isArray(loaded.dependencies) || loaded.dependencies.some((dep) => typeof dep !== "string")) {
      throw new Error('"dependencies" property returned from load() must be of type string[]');
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
var absolute = /^([a-z]+:)?\/?\//;
var scheme = /^[a-z]+:/;
function resolve(base2, path) {
  if (scheme.test(path))
    return path;
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i2 = 0; i2 < pathparts.length; i2 += 1) {
    const part = pathparts[i2];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function is_root_relative(path) {
  return path[0] === "/" && path[1] !== "/";
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
function domain_matches(hostname, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized)
    return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized)
    return true;
  return path.startsWith(normalized + "/");
}
async function load_node({
  event,
  options,
  state,
  route,
  node,
  $session,
  stuff,
  is_error,
  is_leaf,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  const cookies = parse_1(event.request.headers.get("cookie") || "");
  const new_cookies = [];
  let loaded;
  const should_prerender = node.module.prerender ?? options.prerender.default;
  const shadow = is_leaf ? await load_shadow_data(route, event, options, should_prerender) : {};
  if (shadow.cookies) {
    shadow.cookies.forEach((header) => {
      new_cookies.push(parseString_1(header));
    });
  }
  if (shadow.error) {
    loaded = {
      status: shadow.status,
      error: shadow.error
    };
  } else if (shadow.redirect) {
    loaded = {
      status: shadow.status,
      redirect: shadow.redirect
    };
  } else if (module2.load) {
    const load_input = {
      url: state.prerendering ? create_prerendering_url_proxy(event.url) : event.url,
      params: event.params,
      props: shadow.body || {},
      routeId: event.routeId,
      get session() {
        if (node.module.prerender ?? options.prerender.default) {
          throw Error("Attempted to access session from a prerendered page. Session would never be populated.");
        }
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let requested;
        if (typeof resource === "string") {
          requested = resource;
        } else {
          requested = resource.url;
          opts = __spreadValues({
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity
          }, opts);
        }
        opts.headers = new Headers(opts.headers);
        for (const [key2, value] of event.request.headers) {
          if (key2 !== "authorization" && key2 !== "cookie" && key2 !== "host" && key2 !== "if-none-match" && !opts.headers.has(key2)) {
            opts.headers.set(key2, value);
          }
        }
        const resolved = resolve(event.url.pathname, requested.split("?")[0]);
        let response;
        let dependency;
        const prefix = options.paths.assets || options.paths.base;
        const filename = decodeURIComponent(resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = options.manifest.assets.has(filename);
        const is_asset_html = options.manifest.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (options.read) {
            const type = is_asset ? options.manifest.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            response = new Response(options.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else {
            response = await fetch(`${event.url.origin}/${file}`, opts);
          }
        } else if (is_root_relative(resolved)) {
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            const authorization = event.request.headers.get("authorization");
            const combined_cookies = __spreadValues({}, cookies);
            for (const cookie2 of new_cookies) {
              if (!domain_matches(event.url.hostname, cookie2.domain))
                continue;
              if (!path_matches(resolved, cookie2.path))
                continue;
              combined_cookies[cookie2.name] = cookie2.value;
            }
            const cookie = Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
            if (cookie) {
              opts.headers.set("cookie", cookie);
            }
            if (authorization && !opts.headers.has("authorization")) {
              opts.headers.set("authorization", authorization);
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          response = await respond(new Request(new URL(requested, event.url).href, __spreadValues({}, opts)), options, __spreadProps(__spreadValues({}, state), {
            initiator: route
          }));
          if (state.prerendering) {
            dependency = { response, body: null };
            state.prerendering.dependencies.set(resolved, dependency);
          }
        } else {
          if (resolved.startsWith("//")) {
            requested = event.url.protocol + requested;
          }
          if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
            uses_credentials = true;
            const cookie = event.request.headers.get("cookie");
            if (cookie)
              opts.headers.set("cookie", cookie);
          }
          const external_request = new Request(requested, opts);
          response = await options.hooks.externalFetch.call(null, external_request);
        }
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          new_cookies.push(...splitCookiesString_1(set_cookie).map((str) => parseString_1(str)));
        }
        const proxy = new Proxy(response, {
          get(response2, key2, _receiver) {
            async function text() {
              const body = await response2.text();
              const headers = {};
              for (const [key3, value] of response2.headers) {
                if (key3 !== "set-cookie" && key3 !== "etag") {
                  headers[key3] = value;
                }
              }
              if (!opts.body || typeof opts.body === "string") {
                const status_number = Number(response2.status);
                if (isNaN(status_number)) {
                  throw new Error(`response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`);
                }
                fetched.push({
                  url: requested,
                  body: opts.body,
                  response: {
                    status: status_number,
                    statusText: response2.statusText,
                    headers,
                    body
                  }
                });
              }
              if (dependency) {
                dependency.body = body;
              }
              return body;
            }
            if (key2 === "arrayBuffer") {
              return async () => {
                const buffer = await response2.arrayBuffer();
                if (dependency) {
                  dependency.body = new Uint8Array(buffer);
                }
                return buffer;
              };
            }
            if (key2 === "text") {
              return text;
            }
            if (key2 === "json") {
              return async () => {
                return JSON.parse(await text());
              };
            }
            return Reflect.get(response2, key2, response2);
          }
        });
        return proxy;
      },
      stuff: __spreadValues({}, stuff),
      status: is_error ? status ?? null : null,
      error: is_error ? error2 ?? null : null
    };
    if (options.dev) {
      Object.defineProperty(load_input, "page", {
        get: () => {
          throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
        }
      });
    }
    loaded = await module2.load.call(null, load_input);
    if (!loaded) {
      throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
    }
  } else if (shadow.body) {
    loaded = {
      props: shadow.body
    };
  } else {
    loaded = {};
  }
  if (shadow.body && state.prerendering) {
    const pathname = `${event.url.pathname.replace(/\/$/, "")}/__data.json`;
    const dependency = {
      response: new Response(void 0),
      body: JSON.stringify(shadow.body)
    };
    state.prerendering.dependencies.set(pathname, dependency);
  }
  return {
    node,
    props: shadow.body,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers: new_cookies.map((new_cookie) => {
      const _a = new_cookie, { name, value } = _a, options2 = __objRest(_a, ["name", "value"]);
      return serialize_1(name, value, options2);
    }),
    uses_credentials
  };
}
async function load_shadow_data(route, event, options, prerender) {
  if (!route.shadow)
    return {};
  try {
    const mod = await route.shadow();
    if (prerender && (mod.post || mod.put || mod.del || mod.patch)) {
      throw new Error("Cannot prerender pages that have endpoints with mutative methods");
    }
    const method = normalize_request_method(event);
    const is_get = method === "head" || method === "get";
    const handler = method === "head" ? mod.head || mod.get : mod[method];
    if (!handler && !is_get) {
      return {
        status: 405,
        error: new Error(`${method} method not allowed`)
      };
    }
    const data = {
      status: 200,
      cookies: [],
      body: {}
    };
    if (!is_get) {
      const result = await handler(event);
      if (result.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status, headers, body } = validate_shadow_output(result);
      data.status = status;
      add_cookies(data.cookies, headers);
      if (status >= 300 && status < 400) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = body;
    }
    const get = method === "head" && mod.head || mod.get;
    if (get) {
      const result = await get(event);
      if (result.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status, headers, body } = validate_shadow_output(result);
      add_cookies(data.cookies, headers);
      data.status = status;
      if (status >= 400) {
        data.error = new Error("Failed to load data");
        return data;
      }
      if (status >= 300) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = __spreadValues(__spreadValues({}, body), data.body);
    }
    return data;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    return {
      status: 500,
      error: error2
    };
  }
}
function add_cookies(target, headers) {
  const cookies = headers["set-cookie"];
  if (cookies) {
    if (Array.isArray(cookies)) {
      target.push(...cookies);
    } else {
      target.push(cookies);
    }
  }
}
function validate_shadow_output(result) {
  const { status = 200, body = {} } = result;
  let headers = result.headers || {};
  if (headers instanceof Headers) {
    if (headers.has("set-cookie")) {
      throw new Error("Endpoint request handler cannot use Headers interface with Set-Cookie headers");
    }
  } else {
    headers = lowercase_keys(headers);
  }
  if (!is_pojo(body)) {
    throw new Error("Body returned from endpoint request handler must be a plain object");
  }
  return { status, headers, body };
}
async function respond_with_error({
  event,
  options,
  state,
  $session,
  status,
  error: error2,
  resolve_opts
}) {
  try {
    const branch = [];
    let stuff = {};
    if (resolve_opts.ssr) {
      const default_layout = await options.manifest._.nodes[0]();
      const default_error = await options.manifest._.nodes[1]();
      const layout_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        node: default_layout,
        $session,
        stuff: {},
        is_error: false,
        is_leaf: false
      });
      const error_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        node: default_error,
        $session,
        stuff: layout_loaded ? layout_loaded.stuff : {},
        is_error: true,
        is_leaf: false,
        status,
        error: error2
      });
      branch.push(layout_loaded, error_loaded);
      stuff = error_loaded.stuff;
    }
    return await render_response({
      options,
      state,
      $session,
      page_config: {
        hydrate: options.hydrate,
        router: options.router
      },
      stuff,
      status,
      error: error2,
      branch,
      event,
      resolve_opts
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return new Response(error3.stack, {
      status: 500
    });
  }
}
async function respond$1(opts) {
  const { event, options, state, $session, route, resolve_opts } = opts;
  let nodes;
  if (!resolve_opts.ssr) {
    return await render_response(__spreadProps(__spreadValues({}, opts), {
      branch: [],
      page_config: {
        hydrate: true,
        router: true
      },
      status: 200,
      error: null,
      event,
      stuff: {}
    }));
  }
  try {
    nodes = await Promise.all(route.a.map((n) => n == void 0 ? n : options.manifest._.nodes[n]()));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return await respond_with_error({
      event,
      options,
      state,
      $session,
      status: 500,
      error: error3,
      resolve_opts
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options);
  if (state.prerendering) {
    const should_prerender = leaf.prerender ?? options.prerender.default;
    if (!should_prerender) {
      return new Response(void 0, {
        status: 204
      });
    }
  }
  let branch = [];
  let status = 200;
  let error2 = null;
  let set_cookie_headers = [];
  let stuff = {};
  ssr: {
    for (let i2 = 0; i2 < nodes.length; i2 += 1) {
      const node = nodes[i2];
      let loaded;
      if (node) {
        try {
          loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
            node,
            stuff,
            is_error: false,
            is_leaf: i2 === nodes.length - 1
          }));
          set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
          if (loaded.loaded.redirect) {
            return with_cookies(new Response(void 0, {
              status: loaded.loaded.status,
              headers: {
                location: loaded.loaded.redirect
              }
            }), set_cookie_headers);
          }
          if (loaded.loaded.error) {
            ({ status, error: error2 } = loaded.loaded);
          }
        } catch (err) {
          const e2 = coalesce_to_error(err);
          options.handle_error(e2, event);
          status = 500;
          error2 = e2;
        }
        if (loaded && !error2) {
          branch.push(loaded);
        }
        if (error2) {
          while (i2--) {
            if (route.b[i2]) {
              const index5 = route.b[i2];
              const error_node = await options.manifest._.nodes[index5]();
              let node_loaded;
              let j = i2;
              while (!(node_loaded = branch[j])) {
                j -= 1;
              }
              try {
                const error_loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
                  node: error_node,
                  stuff: node_loaded.stuff,
                  is_error: true,
                  is_leaf: false,
                  status,
                  error: error2
                }));
                if (error_loaded.loaded.error) {
                  continue;
                }
                page_config = get_page_config(error_node.module, options);
                branch = branch.slice(0, j + 1).concat(error_loaded);
                stuff = __spreadValues(__spreadValues({}, node_loaded.stuff), error_loaded.stuff);
                break ssr;
              } catch (err) {
                const e2 = coalesce_to_error(err);
                options.handle_error(e2, event);
                continue;
              }
            }
          }
          return with_cookies(await respond_with_error({
            event,
            options,
            state,
            $session,
            status,
            error: error2,
            resolve_opts
          }), set_cookie_headers);
        }
      }
      if (loaded && loaded.loaded.stuff) {
        stuff = __spreadValues(__spreadValues({}, stuff), loaded.loaded.stuff);
      }
    }
  }
  try {
    return with_cookies(await render_response(__spreadProps(__spreadValues({}, opts), {
      stuff,
      event,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    })), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return with_cookies(await respond_with_error(__spreadProps(__spreadValues({}, opts), {
      status: 500,
      error: error3
    })), set_cookie_headers);
  }
}
function get_page_config(leaf, options) {
  if ("ssr" in leaf) {
    throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs/hooks#handle");
  }
  return {
    router: "router" in leaf ? !!leaf.router : options.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    set_cookie_headers.forEach((value) => {
      response.headers.append("set-cookie", value);
    });
  }
  return response;
}
async function render_page(event, route, options, state, resolve_opts) {
  if (state.initiator === route) {
    return new Response(`Not found: ${event.url.pathname}`, {
      status: 404
    });
  }
  if (route.shadow) {
    const type = negotiate(event.request.headers.get("accept") || "text/html", [
      "text/html",
      "application/json"
    ]);
    if (type === "application/json") {
      return render_endpoint(event, await route.shadow());
    }
  }
  const $session = await options.hooks.getSession(event);
  return respond$1({
    event,
    options,
    state,
    $session,
    resolve_opts,
    route
  });
}
function negotiate(accept, types2) {
  const parts = accept.split(",").map((str, i2) => {
    const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      return { type, subtype, q: +q, i: i2 };
    }
    throw new Error(`Invalid Accept header: ${accept}`);
  }).sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types2) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function exec(match, names, types2, matchers) {
  const params = {};
  for (let i2 = 0; i2 < names.length; i2 += 1) {
    const name = names[i2];
    const type = types2[i2];
    const value = match[i2 + 1] || "";
    if (type) {
      const matcher = matchers[type];
      if (!matcher)
        throw new Error(`Missing "${type}" param matcher`);
      if (!matcher(value))
        return;
    }
    params[name] = value;
  }
  return params;
}
var DATA_SUFFIX = "/__data.json";
var default_transform = ({ html }) => html;
async function respond(request, options, state) {
  var _a, _b, _c, _d;
  let url = new URL(request.url);
  const { parameter, allowed } = options.method_override;
  const method_override = (_a = url.searchParams.get(parameter)) == null ? void 0 : _a.toUpperCase();
  if (method_override) {
    if (request.method === "POST") {
      if (allowed.includes(method_override)) {
        request = new Proxy(request, {
          get: (target, property, _receiver) => {
            if (property === "method")
              return method_override;
            return Reflect.get(target, property, target);
          }
        });
      } else {
        const verb = allowed.length === 0 ? "enabled" : "allowed";
        const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs/configuration#methodoverride`;
        return new Response(body, {
          status: 400
        });
      }
    } else {
      throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
    }
  }
  let decoded = decodeURI(url.pathname);
  let route = null;
  let params = {};
  if (options.paths.base && !((_b = state.prerendering) == null ? void 0 : _b.fallback)) {
    if (!decoded.startsWith(options.paths.base)) {
      return new Response(void 0, { status: 404 });
    }
    decoded = decoded.slice(options.paths.base.length) || "/";
  }
  const is_data_request = decoded.endsWith(DATA_SUFFIX);
  if (is_data_request) {
    const data_suffix_length = DATA_SUFFIX.length - (options.trailing_slash === "always" ? 1 : 0);
    decoded = decoded.slice(0, -data_suffix_length) || "/";
    url = new URL(url.origin + url.pathname.slice(0, -data_suffix_length) + url.search);
  }
  if (!((_c = state.prerendering) == null ? void 0 : _c.fallback)) {
    const matchers = await options.manifest._.matchers();
    for (const candidate of options.manifest._.routes) {
      const match = candidate.pattern.exec(decoded);
      if (!match)
        continue;
      const matched = exec(match, candidate.names, candidate.types, matchers);
      if (matched) {
        route = candidate;
        params = decode_params(matched);
        break;
      }
    }
  }
  if (route) {
    if (route.type === "page") {
      const normalized = normalize_path(url.pathname, options.trailing_slash);
      if (normalized !== url.pathname && !((_d = state.prerendering) == null ? void 0 : _d.fallback)) {
        return new Response(void 0, {
          status: 301,
          headers: {
            "x-sveltekit-normalize": "1",
            location: (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
          }
        });
      }
    } else if (is_data_request) {
      return new Response(void 0, {
        status: 404
      });
    }
  }
  const event = {
    get clientAddress() {
      if (!state.getClientAddress) {
        throw new Error(`${"svelte-adapter-firebase"} does not specify getClientAddress. Please raise an issue`);
      }
      Object.defineProperty(event, "clientAddress", {
        value: state.getClientAddress()
      });
      return event.clientAddress;
    },
    locals: {},
    params,
    platform: state.platform,
    request,
    routeId: route && route.id,
    url
  };
  const removed = (property, replacement, suffix = "") => ({
    get: () => {
      throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
    }
  });
  const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
  const body_getter = {
    get: () => {
      throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
    }
  };
  Object.defineProperties(event, {
    method: removed("method", "request.method", details),
    headers: removed("headers", "request.headers", details),
    origin: removed("origin", "url.origin"),
    path: removed("path", "url.pathname"),
    query: removed("query", "url.searchParams"),
    body: body_getter,
    rawBody: body_getter
  });
  let resolve_opts = {
    ssr: true,
    transformPage: default_transform
  };
  try {
    const response = await options.hooks.handle({
      event,
      resolve: async (event2, opts) => {
        var _a2;
        if (opts) {
          resolve_opts = {
            ssr: opts.ssr !== false,
            transformPage: opts.transformPage || default_transform
          };
        }
        if ((_a2 = state.prerendering) == null ? void 0 : _a2.fallback) {
          return await render_response({
            event: event2,
            options,
            state,
            $session: await options.hooks.getSession(event2),
            page_config: { router: true, hydrate: true },
            stuff: {},
            status: 200,
            error: null,
            branch: [],
            resolve_opts: __spreadProps(__spreadValues({}, resolve_opts), {
              ssr: false
            })
          });
        }
        if (route) {
          let response2;
          if (is_data_request && route.type === "page" && route.shadow) {
            response2 = await render_endpoint(event2, await route.shadow());
            if (request.headers.has("x-sveltekit-load")) {
              if (response2.status >= 300 && response2.status < 400) {
                const location = response2.headers.get("location");
                if (location) {
                  const headers = new Headers(response2.headers);
                  headers.set("x-sveltekit-location", location);
                  response2 = new Response(void 0, {
                    status: 204,
                    headers
                  });
                }
              }
            }
          } else {
            response2 = route.type === "endpoint" ? await render_endpoint(event2, await route.load()) : await render_page(event2, route, options, state, resolve_opts);
          }
          if (response2) {
            if (response2.status === 200 && response2.headers.has("etag")) {
              let if_none_match_value = request.headers.get("if-none-match");
              if (if_none_match_value == null ? void 0 : if_none_match_value.startsWith('W/"')) {
                if_none_match_value = if_none_match_value.substring(2);
              }
              const etag = response2.headers.get("etag");
              if (if_none_match_value === etag) {
                const headers = new Headers({ etag });
                for (const key2 of [
                  "cache-control",
                  "content-location",
                  "date",
                  "expires",
                  "vary"
                ]) {
                  const value = response2.headers.get(key2);
                  if (value)
                    headers.set(key2, value);
                }
                return new Response(void 0, {
                  status: 304,
                  headers
                });
              }
            }
            return response2;
          }
        }
        if (!state.initiator) {
          const $session = await options.hooks.getSession(event2);
          return await respond_with_error({
            event: event2,
            options,
            state,
            $session,
            status: 404,
            error: new Error(`Not found: ${event2.url.pathname}`),
            resolve_opts
          });
        }
        if (state.prerendering) {
          return new Response("not found", { status: 404 });
        }
        return await fetch(request);
      },
      get request() {
        throw new Error("request in handle has been replaced with event" + details);
      }
    });
    if (response && !(response instanceof Response)) {
      throw new Error("handle must return a Response object" + details);
    }
    return response;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    try {
      const $session = await options.hooks.getSession(event);
      return await respond_with_error({
        event,
        options,
        state,
        $session,
        status: 500,
        error: error2,
        resolve_opts
      });
    } catch (e22) {
      const error3 = coalesce_to_error(e22);
      return new Response(options.dev ? error3.stack : error3.message, {
        status: 500
      });
    }
  }
}
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
var template = ({ head, body, assets: assets2, nonce }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<meta name="description" content="Svelte demo app" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var read = null;
set_paths({ "base": "", "assets": "" });
var Server = class {
  constructor(manifest2) {
    this.options = {
      csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
      dev: false,
      floc: false,
      get_stack: (error2) => String(error2),
      handle_error: (error2, event) => {
        this.options.hooks.handleError({
          error: error2,
          event,
          get request() {
            throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
          }
        });
        error2.stack = this.options.get_stack(error2);
      },
      hooks: null,
      hydrate: true,
      manifest: manifest2,
      method_override: { "parameter": "_method", "allowed": [] },
      paths: { base, assets },
      prefix: assets + "/_app/immutable/",
      prerender: {
        default: false,
        enabled: true
      },
      read,
      root: Root,
      service_worker: null,
      router: true,
      template,
      template_contains_nonce: false,
      trailing_slash: "never"
    };
  }
  async respond(request, options = {}) {
    if (!(request instanceof Request)) {
      throw new Error("The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
    }
    if (!this.options.hooks) {
      const module2 = await Promise.resolve().then(() => (init_hooks_1c45ba0b(), hooks_1c45ba0b_exports));
      this.options.hooks = {
        getSession: module2.getSession || (() => ({})),
        handle: module2.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
        handleError: module2.handleError || (({ error: error2 }) => console.error(error2.stack)),
        externalFetch: module2.externalFetch || fetch
      };
    }
    return respond(request, this.options, options);
  }
};

// .svelte-kit/output/server/manifest.js
init_shims();
var manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set(["favicon.png", "robots.txt"]),
  mimeTypes: { ".png": "image/png", ".txt": "text/plain" },
  _: {
    entry: { "file": "start-01046cdb.js", "js": ["start-01046cdb.js", "chunks/index-433ca775.js", "chunks/index-8062e47b.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => (init__(), __exports)),
      () => Promise.resolve().then(() => (init__2(), __exports2)),
      () => Promise.resolve().then(() => (init__3(), __exports3)),
      () => Promise.resolve().then(() => (init__4(), __exports4))
    ],
    routes: [
      {
        type: "page",
        id: "",
        pattern: /^\/$/,
        names: [],
        types: [],
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      },
      {
        type: "page",
        id: "about",
        pattern: /^\/about\/?$/,
        names: [],
        types: [],
        path: "/about",
        shadow: null,
        a: [0, 3],
        b: [1]
      }
    ],
    matchers: async () => {
      return {};
    }
  }
};

// .svelte-kit/firebase/firebase-to-svelte-kit.js
init_shims();
function toSvelteKitRequest(request) {
  const host = `${request.headers["x-forwarded-proto"]}://${request.headers.host}`;
  const { href, pathname, searchParams: searchParameters } = new URL(request.url || "", host);
  return new Request(href, {
    method: request.method,
    headers: toSvelteKitHeaders(request.headers),
    body: request.rawBody ? request.rawBody : null,
    host,
    path: pathname,
    query: searchParameters
  });
}
function toSvelteKitHeaders(headers) {
  const finalHeaders = {};
  for (const [key2, value] of Object.entries(headers)) {
    finalHeaders[key2] = Array.isArray(value) ? value.join(",") : value;
  }
  return finalHeaders;
}

// .svelte-kit/firebase/entry.js
var server = new Server(manifest);
async function svelteKit(request, response) {
  const rendered = await server.respond(toSvelteKitRequest(request));
  const body = await rendered.text();
  return rendered ? response.writeHead(rendered.status, rendered.headers).end(body) : response.writeHead(404, "Not Found").end();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
