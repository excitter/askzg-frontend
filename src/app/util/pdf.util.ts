export function downloadPdf(blob: Blob, name: string) {
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, name + '.pdf');
  } else {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = name + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
