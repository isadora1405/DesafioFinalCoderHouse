const produtos = [{id: 1, nome: "Teste"}];

const getProdutos = ('/', (req, res) => {
    res.send(produtos);
});
;
module.exports = {
    getProdutos
}