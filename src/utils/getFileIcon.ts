import csvImg from "/icons/csv.png";
import textImg from "/icons/txt-l1.png";
import pdfImg from "/icons/pdf.png";
import docImg from "/icons/doc.png";
import zipImg from "/icons/zip.png";
import xlsImg from "/icons/xls.png";
import keyImg from "/icons/key.png";
import pptImg from "/icons/ppt.png";
import markdownImg from "/icons/md.png";
import jsImg from "/icons/js.png";
import pythonImg from "/icons/python.png";
import jsonImg from "/icons/json.png";
import torrentImg from "/icons/torrent.png";
import yamlImg from "/icons/yaml.png";
import binaryImgImg from "/icons/binary.png";
import javaImg from "/icons/java.png";
import htmlImg from "/icons/html.png";
import cssImg from "/icons/css.png";
import rarImg from "/icons/rar.png";
import unknownImg from "/icons/unknown.png";

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
    case "binary":
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
