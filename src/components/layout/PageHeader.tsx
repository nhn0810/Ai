export default function PageHeader({ title }: { title: string }) {
    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 max-w-[430px] w-full bg-white/90 backdrop-blur-sm z-20 p-4 border-b">
            <h1 className="text-xl font-bold text-center text-secondary">{title}</h1>
        </div>
    );
}
