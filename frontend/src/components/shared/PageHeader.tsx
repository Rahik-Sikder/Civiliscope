import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    titleAccent?: string;
    description?: string;
    descriptionMaxWidth?: string;
    stats?: {
        value: string | number;
        label: string;
        className?: string;
    }[];
    additionalContent?: ReactNode;
}

export default function PageHeader({ 
    title, 
    titleAccent, 
    description, 
    descriptionMaxWidth = "max-w-2xl",
    stats, 
    additionalContent 
}: PageHeaderProps) {
    return (
        <div className="glass-patriot border-b border-patriot-neon-red/20">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center space-y-6">
                    <h1 className="text-5xl lg:text-6xl font-bold tracking-wider">
                        {titleAccent && (
                            <span className="neon-red">{titleAccent}</span>
                        )}{" "}
                        <span className="holographic">{title}</span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue mx-auto rounded-full"></div>
                    {description && (
                        <p className={`text-xl text-gray-300 ${descriptionMaxWidth} mx-auto`}>
                            {description}
                        </p>
                    )}

                    {/* Stats Bar */}
                    {stats && stats.length > 0 && (
                        <div className="flex justify-center items-center space-x-8 pt-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold ${stat.className || 'neon-red'}`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </div>
                                    {index < stats.length - 1 && (
                                        <div className="w-px h-8 bg-gradient-to-b from-patriot-neon-red to-patriot-neon-blue mx-8"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Additional Content */}
                    {additionalContent && (
                        <div className="pt-4">
                            {additionalContent}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}