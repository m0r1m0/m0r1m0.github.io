interface ParsedMarkdown {
  data: {
    [key: string]: string;
  };
  content: string;
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

      // matter
      if (isMatter) {
        const dataRegExp = /(.+): {0,1}(.+)/;
        const matched = dataRegExp.exec(line);
        if (matched === null) return acc;
        return {
          ...acc,
          data: {
            ...acc.data,
            [matched[1].trim()]: matched[2],
          },
        };
      }

      // content
      return {
        ...acc,
        content: `${acc.content}${line}${i !== lines.length - 1 ? "\n" : ""}`,
      };
    },
    {
      data: {},
      content: "",
    }
  );
}
