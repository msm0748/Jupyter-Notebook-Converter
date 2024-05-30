<script lang="ts">
  import showdown from 'showdown';
  import hljs from 'highlight.js';
  // import 'highlight.js/styles/atom-one-dark.min.css'; // 원하는 스타일 테마를 import
  import 'highlight.js/styles/vs2015.css';

  let fileInput: HTMLInputElement;
  let outputDiv: HTMLDivElement;

  const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const notebookContent: NbData = JSON.parse(e.target!.result as string);
        const converter = new showdown.Converter();
        let markdownContent = '';
        notebookContent.cells.forEach((cell: Cell) => {
          if (cell.cell_type === 'markdown') {
            const markdownText = cell.source.join('\n');
            markdownContent += markdownText + '\n\n';
          } else if (cell.cell_type === 'code') {
            markdownContent += `\`\`\`python\n${cell.source.join('')}\n\`\`\`\n\n`;
            for (const output of cell.outputs) {
              if (output.data && output.data['image/png']) {
                const base64Image = output.data['image/png'];
                markdownContent += `<img src="data:image/png;base64,${base64Image}"/>\n\n`;
              }
            }
          }
        });
        const htmlContent = converter.makeHtml(markdownContent);
        outputDiv.innerHTML = htmlContent;
        outputDiv.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightBlock(block as HTMLElement);
        });
      };
      reader.readAsText(file);
    }
  };

  const copyOutput = async () => {
    try {
      const outputText = outputDiv.innerHTML;
      if (outputText) {
        await navigator.clipboard.writeText(outputText);
        console.log('Output text copied to clipboard');
      } else {
        console.log('No output text to copy');
      }
    } catch (err) {
      console.error('Failed to copy output text: ', err);
    }
  };
</script>

<main>
  <input type="file" id="fileInput" accept=".ipynb" bind:this={fileInput} on:change={handleFileChange} />
  <div bind:this={outputDiv}></div>

  <!-- <button id="copyButton" on:click={copyOutput}>Copy Output</button> -->
</main>

<style>
</style>
