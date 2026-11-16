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
        //ssh -R 80:127.0.0.1:8000 nokey@localhost.run в консоль вставить выдаст ссылку с окончанием life потом добавить/api/generate
        //перед этим запустить uvicorn: python -m uvicorn server:app --host 127.0.0.1 --port 8000 и перед этим перейти в консоли на путь где лежит папка с файлами
        const response = await fetch('https://b13fd502015706.app.lhr.life/api/generate', {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            body: JSON.stringify({
                model: 'qwen3-coder:30b',
                prompt: prompt,
                stream: true
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const reader = response.body.getReader();
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
    if (e.key === 'Enter') {
        askModel();
    }
});
