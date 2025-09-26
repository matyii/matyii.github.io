import jsPDF from "jspdf";
import { PDFDocument } from 'pdf-lib';

export function generateCVPDF(cvData: any) {
  if (!cvData) return;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 60;

  
  if (cvData.avatar) {
    try {
      doc.addImage(cvData.avatar, 'JPEG', pageWidth - 90, 30, 60, 60, undefined, 'FAST');
    } catch (e) {}
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(cvData.name, pageWidth/2, y, { align: 'center' });
  y += 32;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor('#666');
  doc.text(cvData.birth, pageWidth/2, y, { align: 'center' });
  y += 32;

  doc.setTextColor('#222');
  const leftMargin = 40;
  const rightMargin = 40;
  const textWidth = pageWidth - leftMargin - rightMargin;
    for (const category of cvData.categories) {
      
      let categoryHeight = 48 + 8; 
      let first = true;
      for (const item of category.items) {
        categoryHeight += first ? 14 : 18;
        first = false;
        let lines: string[] = [];
        if (typeof item === 'string') {
          lines = doc.splitTextToSize(item, textWidth);
        } else if (item.label && item.level) {
          lines = doc.splitTextToSize(`${item.label}: ${item.level}`, textWidth);
        } else if (item.label && item.value) {
          lines = doc.splitTextToSize(`${item.label}: ${item.value}`, textWidth);
        } else if (category.title === 'Job Experience' && item.company && item.position) {
          let jobText = `${item.position} @ ${item.company}`;
          let dateText = `${item.from} – ${item.current ? 'Present' : item.to || ''}`;
          let techText = item.technologies ? `${item.technologies}` : '';
          lines = [jobText, dateText];
          if (techText) lines.push(techText);
        } else {
          lines = doc.splitTextToSize(JSON.stringify(item), textWidth);
        }
        categoryHeight += lines.length * 16;
      }
      
      if (y + categoryHeight > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        y = 60;
      }
      y += 48;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.text(category.title, leftMargin, y - 8);
      const titleWidth = doc.getTextWidth(category.title);
      doc.setDrawColor(60, 40, 80);
      doc.setLineWidth(1.2);
      doc.line(leftMargin, y - 5, leftMargin + titleWidth, y - 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      first = true;
      for (const item of category.items) {
        y += first ? 14 : 18;
        first = false;
        let lines: string[] = [];
        if (typeof item === 'string') {
          lines = doc.splitTextToSize(item, textWidth);
        } else if (item.label && item.level) {
          lines = doc.splitTextToSize(`${item.label}: ${item.level}`, textWidth);
        } else if (item.label && item.value) {
          lines = doc.splitTextToSize(`${item.label}: ${item.value}`, textWidth);
        } else if (category.title === 'Job Experience' && item.company && item.position) {
          let jobText = `${item.position} @ ${item.company}`;
          let dateText = `${item.from} – ${item.current ? 'Present' : item.to || ''}`;
          let techText = item.technologies ? `${item.technologies}` : '';
          lines = [jobText, dateText];
          if (techText) lines.push(techText);
        } else {
          lines = doc.splitTextToSize(JSON.stringify(item), textWidth);
        }
        doc.setTextColor('#444');
        for (const line of lines) {
          doc.text(line, leftMargin + 10, y);
          y += 16;
        }
      }
      doc.setTextColor('#222');
    }

  doc.setFontSize(10);
  doc.setTextColor('#aaa');
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  let hour = now.getHours();
  const minute = String(now.getMinutes()).padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; 
  const timeStr = `${hour}:${minute} ${ampm}`;
  const dateStr = `${day}/${month}/${year}, ${timeStr}`;
  doc.text(`Generated on itsmatyii.dev — ${dateStr}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 30, { align: 'center' });

  
  if (typeof window !== 'undefined') {
    fetch('/data/ecdl.pdf')
      .then(res => res.arrayBuffer())
      .then(async (certBuffer) => {
        
        const cvBytes = doc.output('arraybuffer');
        
        const cvPdf = await PDFDocument.load(cvBytes);
        const certPdf = await PDFDocument.load(certBuffer);
        
        const [certPage] = await cvPdf.copyPages(certPdf, [0]);
        cvPdf.addPage(certPage);
        
        const mergedBytes = await cvPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'cv.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(() => {
        doc.save('cv.pdf');
      });
  } else {
    doc.save('cv.pdf');
  }
}