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

  const response = await fetch(url);

  const responseText = await response.text();

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
