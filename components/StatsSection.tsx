interface Statistic {
  label: string;
  value: string;
  suffix?: string;
  icon: React.ReactNode;
}

interface StatsSectionProps {
  statistics: Statistic[];
}

export default function StatsSection({ statistics }: StatsSectionProps) {
  return (
    <section id="stats" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-5xl font-bold text-slate-900">Nuestro Impacto</h2>
          <p className="text-lg text-slate-600 font-light">Empoderando a millones de argentinos a ahorrar dinero</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="group bg-white/40 backdrop-blur-xl rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 border border-white/40 hover:border-blue-300/50 hover:-translate-y-1"
            >
              <div className="flex justify-center mb-6 text-blue-600 group-hover:scale-125 transition duration-300">
                {stat.icon}
              </div>
              <div className="space-y-3">
                <div className="text-5xl font-bold text-slate-900">
                  {stat.value}
                  {stat.suffix}
                </div>
                <p className="text-slate-700 font-semibold text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}