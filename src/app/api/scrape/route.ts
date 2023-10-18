import { JSDOM } from "jsdom";
// import fetch from "isomorphic-fetch";
import { NextResponse } from "next/server";
import { Readability, isProbablyReaderable } from "@mozilla/readability";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasUrl = searchParams.has("url");

  const url = hasUrl ? searchParams.get("url") : null;

  if (!url) {
    return NextResponse.json({ error: "" });
  }

  let responseText = "";

  const response = await fetch(url);
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("utf8")) {
    const charset = contentType?.substring(contentType.indexOf("charset=") + 8);
    const arrayBuffer = await response.arrayBuffer();

    const dataView = new DataView(arrayBuffer);
    const decoder = new TextDecoder(charset);

    responseText = decoder.decode(dataView);
  } else {
    responseText = await response.text();
  }

  const parsedContent = await parseContent(url, responseText);

  return NextResponse.json({ result: parsedContent });
}

async function parseContent(
  url: string,
  pageContent: string,
): Promise<Record<string, string | number> | null> {
  const dom = new JSDOM(pageContent, { url: url });

  if (!isProbablyReaderable(dom.window.document)) {
    return null;
  }

  const parsedContent = new Readability(dom.window.document).parse();

  return parsedContent;
}
