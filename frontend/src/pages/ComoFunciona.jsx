import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

export default function ComoFunciona() {
  const passos = [
    {
      numero: '01',
      titulo: 'Cadastre seu Equipamento',
      descricao: 'Preencha o formulário informando o tipo do eletrônico, estado de conservação e endereço de coleta.'
    },
    {
      numero: '02',
      titulo: 'Triagem e Agendamento',
      descricao: 'Nossa equipe analisa as informações e agenda a melhor data para recolher o item na sua residência.'
    },
    {
      numero: '03',
      titulo: 'Descarte e Reciclagem Correta',
      descricao: 'Os materiais recebem a destinação ambientalmente adequada, promovendo a economia circular.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900">Como funciona o E-Ciclo?</h1>
          <p className="mt-2 text-slate-600">
            Aprenda como descartar seus resíduos eletrônicos de maneira simples, rápida e segura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {passos.map((passo) => (
            <div key={passo.numero} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-3xl font-black text-emerald-600 font-mono">{passo.numero}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{passo.titulo}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{passo.descricao}</p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-600 text-white rounded-2xl p-8 text-center shadow-md">
          <h2 className="text-xl font-bold">Pronto para fazer a diferença?</h2>
          <p className="mt-1 text-emerald-100 text-sm">
            Doe agora mesmo aquele aparelho parado na sua casa.
          </p>
          <Link
            to="/doar"
            className="mt-6 inline-block bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-lg text-sm shadow hover:bg-emerald-50 transition"
          >
            Fazer Doação Agora
          </Link>
        </div>
      </main>
    </div>
  )
}