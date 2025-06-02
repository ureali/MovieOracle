type HowToUseCardProps = {
    step: string;
    title: string;
    description: string;
    icon:string;
}

export default function HowToUseCard({ step, title, description, icon }:HowToUseCardProps) {
    return (
        <div
            className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-lg w-1/3 mx-2 transition-transform duration-200 hover:-translate-y-1"
        >
            <div className="text-4xl">{icon}</div>

            <h3 className="text-lg font-semibold text-gray-900">
                Step {step}
            </h3>

            <h4 className="text-xl font-bold text-gray-800">{title}</h4>

            <p className="text-center text-sm text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
