import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page non trouvée</h2>
            <p className="text-gray-500 mb-6 max-w-md">
                Désolé, nous n'avons pas pu trouver la page que vous recherchez.
            </p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" >
                Retour à l'accueil
            </Link>
        </div>
    );
}