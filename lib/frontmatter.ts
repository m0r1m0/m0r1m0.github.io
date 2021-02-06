interface ParsedMarkdown {
  matter: {
    [key: string]: string;
  };
  markdown: string;
  ogp: {
    title: string;
    description: string;
    image?: string;
  };
}

/**
 * markdownからfrontmatter、markdown本文、ogp情報にわける
 * @param markdown markdownテキスト
 * @returns Parse後の情報。形式がinvalidの場合、`null`を返す
 */
export function parse(markdown: string): ParsedMarkdown | null {
  const lines = markdown.split("\n");
  let isMatter = false;
  const result = lines.reduce<ParsedMarkdown>(
    (acc, line, i) => {
      // matter start or end
      if (line === "---") {
        isMatter = !isMatter;
        return acc;
      }

      // matter
      if (isMatter) {
        const dataRegExp = /(.+): {0,1}(.+)/;
        const matched = dataRegExp.exec(line);
        if (matched === null) return acc;
        const key = matched[1].trim();
        const value = matched[2];
        if (key === "title" && acc.ogp.title.length === 0) {
          acc.ogp.title = value;
        }
        return {
          ...acc,
          matter: {
            ...acc.matter,
            [key]: value,
          },
        };
      }

      if (acc.ogp.description.length === 0) {
        acc.ogp.description = line;
      }

      const imgMatched = /!\[.*\]\((.+)\)/.exec(line);
      if (acc.ogp.image == null && imgMatched !== null) {
        acc.ogp.image = imgMatched[1];
      }

      // content
      return {
        ...acc,
        markdown: `${acc.markdown}${line}${i !== lines.length - 1 ? "\n" : ""}`,
      };
    },
    {
      matter: {},
      markdown: "",
      ogp: {
        title: "",
        description: "",
      },
    }
  );
  if (isFormatValid(result)) {
    return result;
  }
  return null;
}

/**
 * parse結果がvalidかどうかをチェックする
 * @param parsedMarkdown parse結果
 */
function isFormatValid(parsedMarkdown: ParsedMarkdown): boolean {
  if (parsedMarkdown.matter.title == null) {
    return false;
  }
  return true;
}
