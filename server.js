const express = require('express');
const path = require('path');
const fs = require('fs')
const app = express();

const port = 3000;

// fazer a pasta src ficar publica e pegar os css
app.use(express.static(path.join(__dirname, 'src')));

// rota para pagina principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'Mapa', 'index.html'));
});

//////////////////////////// AREA FORMULARIO ///////////////////////////////////////

//processar os dados do formulario
app.use(express.urlencoded({ extended: true }));

//começar o envio do formulario
app.post('/submit', (req, res) => {
    const {ocorrido, endereco} = req.body;

    //ler se tem um arquivo, se nao fazer um novo
    fs.readFile('ocorrencias.json', 'utf8', (err, data) => {
        if(err) {
            console.error("Erro ao Ler o Arquivo:", err);
            return res.status(500).send("Erro ao Salvar Ocorrência.");
        }

        //parse para um data ou iniciar um vazio
        const ocorrencias = data ? JSON.parse(data) : [];

        //adicionar uma nova ocorrência
        ocorrencias.push({ ocorrido, endereco })

        //gravar as ocorrências no JSON 
        fs.writeFile('ocorrencias.json', JSON.stringify(ocorrencias, null, 2), (err) => {
            if (err) {
                console.error('Erro ao Escrever no Arquivo:', err);
                return res.status(500).send('Erro ao Salvar a Ocorrência.')
            }

            res.redirect('/ocorrencias')
        })
    })
});

app.get('/ocorrencias', (req, res) => {
    fs.readFile('ocorrencias.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Erro ao Ler o Arquivo:", err)
            return res.status(500).send("Erro ao Carregar as Ocorrências")
        }

        const ocorrencias = data ? JSON.parse(data) : [];

        res.send(`
            <h1>Ocorrências Registradas</h1>
            <ul>
                ${ocorrencias.map(o => `<li>${o.ocorrido} - Endereço: ${o.endereco}</li>`).join('')}
            </ul>
            <a href="/">Voltar</a>
        `);
    })
})

// Inicializar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});