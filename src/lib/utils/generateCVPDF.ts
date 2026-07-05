import jsPDF from "jspdf";
import { PDFDocument } from 'pdf-lib';

type CVItemString = string;
type CVItemLabelValue = { label: string; value: string };
type CVItemLabelLevel = { label: string; level: string };
type CVItemJob = {
  company: string;
  position: string;
  from: string;
  to?: string;
  current?: boolean;
  technologies?: string;
};

type CVItem = CVItemString | CVItemLabelValue | CVItemLabelLevel | CVItemJob;

type CVCategory = {
  title: string;
  items: CVItem[];
};

type CVData = {
  name: string;
  birth: string;
  avatar?: string;
  categories: CVCategory[];
};

const COLORS = {
  background: [249, 250, 252] as const,
  panel: [240, 244, 250] as const,
  border: [214, 223, 236] as const,
  title: [23, 30, 50] as const,
  body: [52, 63, 88] as const,
  muted: [112, 124, 150] as const,
  accent: [61, 119, 245] as const,
  accentSoft: [226, 236, 255] as const
};

function setTextColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function setFillColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}

function setDrawColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

function formatGeneratedDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  let hour = now.getHours();
  const minute = String(now.getMinutes()).padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour || 12;
  return `${day}/${month}/${year}, ${hour}:${minute} ${ampm}`;
}

function isJobItem(item: CVItem): item is CVItemJob {
  return typeof item === "object" && item !== null && "company" in item && "position" in item;
}

function isLabelValueItem(item: CVItem): item is CVItemLabelValue {
  return typeof item === "object" && item !== null && "label" in item && "value" in item;
}

function isLabelLevelItem(item: CVItem): item is CVItemLabelLevel {
  return typeof item === "object" && item !== null && "label" in item && "level" in item;
}

function drawPageBackground(doc: jsPDF, pageWidth: number, pageHeight: number) {
  setFillColor(doc, COLORS.background);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
}

function drawFooter(doc: jsPDF, pageWidth: number, pageHeight: number) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.muted);
  doc.text(`Generated on itsmatyii.dev - ${formatGeneratedDate()}`, pageWidth / 2, pageHeight - 24, { align: "center" });
}

async function tryLoadAvatarDataUrl(avatarPath: string): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch(avatarPath);
    if (!response.ok) return null;
    const blob = await response.blob();

    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function estimateCategoryHeight(doc: jsPDF, category: CVCategory, width: number): number {
  let total = 44; // Section title + spacing.

  for (const item of category.items) {
    if (typeof item === "string") {
      total += doc.splitTextToSize(item, width - 28).length * 14 + 10;
    } else if (isLabelValueItem(item) || isLabelLevelItem(item)) {
      const content = `${item.label}: ${isLabelValueItem(item) ? item.value : item.level}`;
      total += doc.splitTextToSize(content, width - 28).length * 14 + 10;
    } else if (isJobItem(item)) {
      const roleLines = doc.splitTextToSize(`${item.position} - ${item.company}`, width - 28).length;
      const periodLines = doc.splitTextToSize(`${item.from} - ${item.current ? "Present" : item.to || ""}`, width - 28).length;
      const techLines = item.technologies ? doc.splitTextToSize(item.technologies, width - 28).length : 0;
      total += (roleLines + periodLines + techLines) * 14 + 14;
    }
  }

  return total + 16;
}

function renderCategory(
  doc: jsPDF,
  category: CVCategory,
  left: number,
  width: number,
  yStart: number
): number {
  let y = yStart;

  setFillColor(doc, COLORS.accentSoft);
  doc.roundedRect(left, y, width, 24, 8, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setTextColor(doc, COLORS.title);
  doc.text(category.title, left + 12, y + 16);

  y += 34;

  for (const item of category.items) {
    const boxX = left;
    const textX = left + 12;
    let boxHeight = 0;
    const lines: string[] = [];

    if (typeof item === "string") {
      lines.push(...doc.splitTextToSize(item, width - 24));
    } else if (isLabelValueItem(item)) {
      lines.push(...doc.splitTextToSize(`${item.label}: ${item.value}`, width - 24));
    } else if (isLabelLevelItem(item)) {
      lines.push(...doc.splitTextToSize(`${item.label}: ${item.level}`, width - 24));
    } else if (isJobItem(item)) {
      lines.push(...doc.splitTextToSize(`${item.position} - ${item.company}`, width - 24));
      lines.push(...doc.splitTextToSize(`${item.from} - ${item.current ? "Present" : item.to || ""}`, width - 24));
      if (item.technologies) {
        lines.push(...doc.splitTextToSize(item.technologies, width - 24));
      }
    } else {
      lines.push(...doc.splitTextToSize(JSON.stringify(item), width - 24));
    }

    boxHeight = lines.length * 14 + 12;

    setFillColor(doc, COLORS.panel);
    setDrawColor(doc, COLORS.border);
    doc.roundedRect(boxX, y, width, boxHeight, 8, 8, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    setTextColor(doc, COLORS.body);

    let textY = y + 14;
    for (const line of lines) {
      doc.text(line, textX, textY);
      textY += 14;
    }

    y += boxHeight + 8;
  }

  return y;
}

function saveBlobAsFile(blob: Blob, filename: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export async function generateCVPDF(cvData: CVData | null) {
  if (!cvData) return;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 44;
  const rightMargin = 44;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  drawPageBackground(doc, pageWidth, pageHeight);

  setFillColor(doc, COLORS.accent);
  doc.roundedRect(leftMargin, 42, 5, 66, 2.5, 2.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  setTextColor(doc, COLORS.title);
  doc.text(cvData.name, leftMargin + 16, 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  setTextColor(doc, COLORS.muted);
  doc.text(cvData.birth, leftMargin + 16, 92);

  if (cvData.avatar) {
    const avatarDataUrl = await tryLoadAvatarDataUrl(cvData.avatar);
    if (avatarDataUrl) {
      try {
        doc.addImage(avatarDataUrl, "JPEG", pageWidth - rightMargin - 56, 44, 56, 56, undefined, "FAST");
      } catch {
        // Ignore avatar drawing failures and continue PDF generation.
      }
    }
  }

  let y = 126;

  for (const category of cvData.categories) {
    const estimatedHeight = estimateCategoryHeight(doc, category, contentWidth);

    if (y + estimatedHeight > pageHeight - 50) {
      drawFooter(doc, pageWidth, pageHeight);
      doc.addPage();
      drawPageBackground(doc, pageWidth, pageHeight);
      y = 56;
    }

    y = renderCategory(doc, category, leftMargin, contentWidth, y) + 6;
  }

  drawFooter(doc, pageWidth, pageHeight);

  if (typeof window === "undefined") {
    doc.save("cv.pdf");
    return;
  }

  try {
    const certResponse = await fetch("/data/ecdl.pdf");
    if (!certResponse.ok) throw new Error("Certificate not found");

    const certBuffer = await certResponse.arrayBuffer();
    const cvBytes = doc.output("arraybuffer");

    const cvPdf = await PDFDocument.load(cvBytes);
    const certPdf = await PDFDocument.load(certBuffer);

    const certPages = await cvPdf.copyPages(certPdf, certPdf.getPageIndices());
    certPages.forEach((page) => cvPdf.addPage(page));

    const mergedBytes = await cvPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    saveBlobAsFile(blob, "cv.pdf");
  } catch {
    doc.save("cv.pdf");
  }
}