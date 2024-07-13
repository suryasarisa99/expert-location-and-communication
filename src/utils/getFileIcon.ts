import csvImg from "/public/icons/csv.png";
import textImg from "/public/icons/txt-l1.png";
import pdfImg from "/public/icons/pdf.png";
import docImg from "/public/icons/doc.png";
import zipImg from "/public/icons/zip.png";
import xlsImg from "/public/icons/xls.png";
import keyImg from "/public/icons/key.png";
import pptImg from "/public/icons/ppt.png";
import markdownImg from "/public/icons/md.png";
import jsImg from "/public/icons/js.png";
import pythonImg from "/public/icons/python.png";
import jsonImg from "/public/icons/json.png";
import torrentImg from "/public/icons/torrent.png";
import yamlImg from "/public/icons/yaml.png";
import binaryImgImg from "/public/icons/binary.png";
import javaImg from "/public/icons/java.png";
import htmlImg from "/public/icons/html.png";
import cssImg from "/public/icons/css.png";
import rarImg from "/public/icons/rar.png";
import unknownImg from "/public/icons/unknown.png";

export default function getFileImg(type: string, ext: string) {
  let img = "";

  switch (ext) {
    case "csv":
      img = csvImg;
      break;
    case "txt":
      img = textImg;
      break;
    case "pdf":
      img = pdfImg;
      break;
    case "doc":
    case "docx":
      img = docImg;
      break;
    case "xls":
    case "xlsx":
      img = xlsImg;
      break;
    case "zip":
      img = zipImg;
      break;
    case "pgp":
    case "key":
      img = keyImg;
      break;
    case "md":
    case "markdown":
      img = markdownImg;
      break;
    case "ppt":
    case "pptx":
    case "odp":
      img = pptImg;
      break;
    case "torrent":
      img = torrentImg;
      break;
    case "json":
      img = jsonImg;
      break;
    case "js":
      img = jsImg;
      break;
    case "py":
      img = pythonImg;
      break;
    case "yaml":
    case "yml":
      img = yamlImg;
      break;
    case "bin":
    case "bianary":
      img = binaryImgImg;
      break;
    case "java":
      img = javaImg;
      break;
    case "html":
      img = htmlImg;
      break;
    case "css":
      img = cssImg;
      break;
    case "rar":
    case "xz":
    case "7z":
    case "tar":
    case "gz":
      img = rarImg;
      break;
    default:
      if (type.startsWith("application")) {
        img = rarImg;
      } else if (type.startsWith("text")) {
        img = textImg;
      } else {
        img = unknownImg;
      }
  }
  return img;
}
