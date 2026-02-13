import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId: string, fileName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // 克隆元素以避免影响原始DOM
  const cloneElement = element.cloneNode(true) as HTMLElement;
  cloneElement.style.width = '210mm';
  cloneElement.style.padding = '0';
  cloneElement.style.margin = '0';
  document.body.appendChild(cloneElement);

  const canvas = await html2canvas(cloneElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  // 移除克隆元素
  document.body.removeChild(cloneElement);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
  });

  const imgWidth = 210;
  const pageHeight = 297; // A4标准高度
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;

  // 添加第一页
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // 自动分页
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // 保存PDF（无水印）
  pdf.save(`${fileName}.pdf`);
};