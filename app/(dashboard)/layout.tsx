export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <aside>sidebar</aside>
            <main>{children}</main>
        </div>
    )
}