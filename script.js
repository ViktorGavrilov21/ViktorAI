const button = document.getElementById('Send-button');
const input = document.getElementById('Promt-input');
const responseBlock = document.getElementById('Response-block');

async function askModel() {
    const prompt = input.value.trim();
    if (!prompt) { return; }

    responseBlock.style.display = 'block';
    responseBlock.textContent = 'Thinking...';
    input.value = '';
    button.disabled = true;

    try {
        const response = await fetch('https://2d270c45585b81.app.lhr.life/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                model: 'qwen3-coder:30b',
                prompt: prompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(HTTP Error: ${response.status});
        }

        const data = await response.json();
        responseBlock.textContent = data.response;
        responseBlock.scrollTop = responseBlock.scrollHeight;

    } catch (error) {
        responseBlock.textContent = 'Error of connection to model: ' + error.message;
        console.error(error);
    } finally {
        button.disabled = false;
    }
}

button.addEventListener('click', askModel);

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        askModel();
    }
});
