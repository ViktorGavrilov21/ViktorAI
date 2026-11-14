const button = document.getElementById('Send-button');
const input = document.getElementById('Promt-input');
const responseBlock = document.getElementById('Response-block');

async function askModel() {
    const prompt = input.ariaValueMax.trim();
    if (!prompt) { return; }

    responseBlock.style.display = 'block';
    responseBlock.textContent = 'Thinking...';
    input.value = '';
    button.disabled = true;

    try {
        const responce = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen3-coder:30b',
                prompt: prompt,
                stream: true
            })
        })

        if (!responce.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const reader = responce.body.getReader();
        const decoder = new TextDecoder('utf-8');
        responseBlock.textContent = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.trim() !== '') {
                    const parsed = JSON.parse(line);
                    responseBlock.textContent += parsed.response;
                    responseBlock.scrollTop = responseBlock.scrollHeight;
                }
            }
        }

    } catch (error) {
        responseBlock.textContent = 'Error of connection to model: ' + error.message;
        console.error(error);
    } finally {
        button.disabled = false;
    }
}

button.addEventListener('click', askModel);

input.addEventListener('keypress', (e) => {
    if (e.key === Enter) {
        askModel();
    }
});