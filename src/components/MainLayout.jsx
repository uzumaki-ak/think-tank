import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AIAssistant from './AIAssistant';

const MainLayout = ({children}) => {
  return (
    <div className="bg-bone dark:bg-matte-black transition-colors duration-500 min-h-screen">
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default MainLayout;
