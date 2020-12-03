interface ParsedMarkdown {
  matter: {
    [key: string]: string;
  };
  markdown: string;
}

export function parse(markdown: string): ParsedMarkdown {
  const lines = markdown.split("\n");
  let isMatter = false;
  return lines.reduce<ParsedMarkdown>(
    (acc, line, i) => {
      // matter start or end
      if (line === "---") {
        isMatter = !isMatter;
        return acc;
      }

      if (line.length === 0) {
        return acc;
      }

      // matter
      if (isMatter) {
        const dataRegExp = /(.+): {0,1}(.+)/;
        const matched = dataRegExp.exec(line);
        if (matched === null) return acc;
        return {
          ...acc,
          matter: {
            ...acc.matter,
            [matched[1].trim()]: matched[2],
          },
        };
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
    }
  );
}
