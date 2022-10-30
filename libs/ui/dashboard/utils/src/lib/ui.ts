export const copyToClipboard = (id: string, value?: string) => {
  if (!value) {
    return;
  }

  navigator.clipboard.writeText(value).then(() => {
    document.getElementById(id)?.classList.add('copied');

    setTimeout(() => {
      document.getElementById(id)?.classList.remove('copied');
    }, 1000);
  });
};
