import { Link } from 'react-router-dom'

const features = [
  { icon: '🔫', title: 'Catálogo Completo', desc: 'Visualize nossa linha de armamentos e munições com especificações detalhadas.' },
  { icon: '🎯', title: 'Estande de Tiro',   desc: 'Agende seu horário e pratique com segurança e supervisão profissional.' },
  { icon: '📚', title: 'Cursos',            desc: 'Capacitação técnica com instrutores especializados para todos os níveis.' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-32 px-4 text-center">
        <div className="text-7xl mb-6">⚔</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Fenhir's Armas & Munições
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Portal institucional especializado em armamentos, munições e treinamentos táticos.
          Acesse o catálogo, conheça nossos cursos e agende no estande.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/produtos" className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded transition-colors">
            Ver Catálogo
          </Link>
          <Link to="/register" className="bg-gray-800 hover:bg-gray-700 text-gray-100 font-semibold px-8 py-3 rounded border border-gray-700 transition-colors">
            Criar Conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">O que oferecemos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-amber-500 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900 border-y border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Pronto para começar?</h2>
          <p className="text-gray-400 mb-8">
            Crie sua conta, acesse o catálogo e demonstre interesse nos produtos.
            Nossa equipe entrará em contato para dar continuidade.
          </p>
          <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-10 py-3 rounded transition-colors inline-block">
            Cadastre-se Gratuitamente
          </Link>
        </div>
      </section>
    </div>
  )
}