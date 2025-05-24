import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header isLandingPage={true} />
      {/* Hero Section */}
      <section className="py-10 md:py-20 px-4 md:px-6 bg-gradient-to-r from-primary/5 to-primary-logo/5 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Left side content */}
            <div className="space-y-6 max-w-2xl text-left">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900"
                style={{
                  fontFamily:
                    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                  letterSpacing: "-0.025em",
                }}
              >
                Did someone say Hurray? Count us in!
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Less Guessing. More Gifting.
                <br />
                No awkward asks. Create your wishlist and for the first time get
                gifts you "actually" want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full"
                  >
                    Get started for free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side logo */}
            <div className="mt-8 lg:mt-0">
              <img
                src="https://i.postimg.cc/kDZBdRVj/gift-box.jpg"
                alt="Gift box hero image"
                className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform brings together technology and community to create a
              seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
              <p className="text-muted-foreground">
                Built with the latest security standards to ensure your data and
                transactions are always protected.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Focused</h3>
              <p className="text-muted-foreground">
                Connect with like-minded individuals and build meaningful
                relationships through shared interests.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Personalized Experience
              </h3>
              <p className="text-muted-foreground">
                Discover products and services tailored to your preferences
                through our advanced recommendation system.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Be part of the future of digital commerce and connect with thousands
            of users worldwide.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
