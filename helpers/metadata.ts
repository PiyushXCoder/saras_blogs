/**
 * Helps to generate metadata for pages
 */

// @ts-nocheck
import { Metadata } from "next";
import { convertToTitleCase } from "./utils";
import { deprecate } from "util";
import { getTranslations } from "next-intl/server";

export async function genMetadata(metadata: Metadata = {}) {
  const t = await getTranslations("common");

  const defaultMetadata: Metadata = {
    title: t("title"),
    description: t("description"),
    authors: { name: "PiyushXCoder" },
    keywords: t("keywords"),
    icons: {
      icon: {
        url: "/favicon.svg",
        type: "image/svg",
      },
    },
  };

  recursiveCopy(metadata, defaultMetadata);

  return defaultMetadata;
}

function recursiveCopy(src: Object, dest: Object) {
  Object.keys(src).forEach((key) => {
    if (typeof src[key] == "object" && dest[key])
      recursiveCopy(src[key], dest[key]);
    else dest[key] = src[key];
  });
}
