"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import { ArrowLeft, SaveIcon } from "lucide-react";

import { cn, variants, trimWhitespace, isURL } from "@/utils";
import { Button, Input, Spinner, Textarea } from "@/components/ui";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [textContent, setTextContent] = useState("");
  const [documentInfo, setDocumentInfo] = useState({
    lang: "",
    title: "",
    siteName: "",
  });

  const contentClass =
    "w-full flex-col items-center justify-center space-y-6 text-center max-w-none md:max-w-4xl";
  const headerClass = "mb-10 text-2xl font-medium text-foreground md:text-4xl";

  const handleFetchContent = async () => {
    if (!isURL(textContent)) {
      return console.log("Invalid URL", textContent);
    }

    setIsLoading(true);

    const response = await fetch(`/api/scrape?url=${textContent}`);
    const res = await response.json();

    if (!res || !res.result) {
      setIsLoading(false);
      return console.log(res);
    }

    const { textContent: content, title, siteName, lang } = res.result;

    setTextContent(content);
    setDocumentInfo({ title, siteName, lang });

    setCurrentStep(3);
    setIsLoading(false);
  };

  const handleFileSaving = () => {
    if (!textContent) {
      return;
    }

    const fileName =
      documentInfo.title.length > 150
        ? documentInfo.title.substring(0, 150)
        : documentInfo.title;

    const blob = new Blob([textContent], { type: "text/plain; charset=utf-8" });
    saveAs(blob, `${fileName}.txt`);
  };

  return (
    <div className="flex max-h-screen min-h-screen flex-col items-center justify-center">
      {currentStep !== 1 && (
        <div className="fixed left-0 top-0 flex w-full items-center justify-between p-6">
          <Button
            variant="outline"
            onClick={() => {
              setTextContent("");
              setCurrentStep((currentStep) => (currentStep -= 1));
            }}
          >
            <ArrowLeft /> Back
          </Button>

          <Button variant="link" asChild>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://byurhannurula.com"
            >
              by Byurhan Nurula
            </a>
          </Button>
        </div>
      )}

      <div className="flex h-full flex-col items-center justify-center space-y-12 p-12 md:p-24">
        {currentStep === 1 && (
          <motion.div
            animate="show"
            initial="hide"
            variants={variants}
            className={cn(contentClass)}
          >
            <h1 className={headerClass}>
              Scraper is a simple tool which can fetch a content of a site or
              post in a matter of a seconds.
            </h1>
            <Button size="lg" type="button" onClick={() => setCurrentStep(2)}>
              Get Started
            </Button>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            animate="show"
            initial="hide"
            variants={variants}
            className={cn(contentClass, "max-w-2xl")}
          >
            <h1 className={headerClass}>
              Enter url of the site or post to scrape
            </h1>
            <form className="flex flex-col items-center justify-center space-y-8 text-center">
              <Input
                type="url"
                value={textContent}
                placeholder="Enter your URL here"
                onChange={(e) => setTextContent(e.currentTarget.value)}
                aria-required
                required
              />
              <Button
                size="lg"
                type="submit"
                className="w-fit"
                disabled={isLoading}
                onClick={async () => handleFetchContent()}
              >
                Scrape Content
                {isLoading && <Spinner size="small" className="ml-3" />}
              </Button>
            </form>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            animate="show"
            initial="hide"
            variants={variants}
            className={cn(contentClass)}
          >
            <h1 className={headerClass}>
              Here is the content of the page that have been scraped
            </h1>
            <Textarea
              value={textContent}
              cols={135}
              rows={25}
              className="resize-none"
              placeholder="Content goes here...."
              onChange={(e) => setTextContent(e.currentTarget.value)}
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button
                variant="secondary"
                onClick={() => setTextContent(trimWhitespace(textContent))}
              >
                Trim whitespaces
              </Button>

              <Button type="button" onClick={() => handleFileSaving()}>
                <SaveIcon className="mr-2 h-4 w-4" /> Save As
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
