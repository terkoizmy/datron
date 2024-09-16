import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const MarketplaceLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default MarketplaceLayout;