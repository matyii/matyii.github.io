function copyToClipboard() {
    var originalText = document.getElementById('discord').innerText;
    var copiedText = '✅ copied!';

    document.getElementById('discord').innerText = copiedText;
    var textToCopy = 'matyii';
    navigator.clipboard.writeText(textToCopy).then(function() {
      console.log('Text copied to clipboard:', textToCopy);
    }).catch(function(err) {
      console.error('Unable to copy text to clipboard', err);
    });
    setTimeout(function() {
      document.getElementById('discord').innerText = originalText;
    }, 2000);
}