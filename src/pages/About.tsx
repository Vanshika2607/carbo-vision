//import React from 'react';
import { Award, Users, Lightbulb, Target } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Dr. Manvinder Sharma",
      role: "Associate Professor",
      image:
        "https://i.postimg.cc/qRxKvZy3/Screenshot-2025-08-12-193100.png",
      description: "Leading product design and user experience innovation",
    },
    {
      name: "Amit Patel",
      role: "Technical Lead",
      image:
        "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg",
      description: "Expert in motor control systems and battery management",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Carbo Vision
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Where innovation meets customization — bringing smart tech, electric
            conversions, and digital solutions to life, one idea at a time.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At CorboVision, we are redefining innovation by turning
                visionary ideas into impactful realities. Our mission is to
                bridge the gap between creativity and technology — offering
                cutting-edge solutions like electric vehicle conversions, smart
                IoT systems, personalized web development, and student-driven
                inventions. We empower individuals and institutions to embrace
                the future with customized, sustainable, and intelligent
                products. Whether it's electrifying a vehicle, automating a
                space, or launching a digital presence — CorboVision is your
                one-stop destination for innovation that moves, connects, and
                inspires.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe in sustainable innovation that not only reduces
                carbon emissions but also provides cost-effective solutions for
                the modern world.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <img
                src="https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg"
                alt="Electric bike conversion"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                Constantly pushing boundaries with cutting-edge technology
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sustainability
              </h3>
              <p className="text-gray-600">
                Environmental responsibility in every decision we make
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality
              </h3>
              <p className="text-gray-600">
                Uncompromising standards in every product we deliver
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community
              </h3>
              <p className="text-gray-600">
                Building stronger, more connected communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate individuals driving our mission forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-gray-300">
              Transforms ideas into smart, sustainable solutions for everyday
              life.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg text-gray-300">Bikes Converted</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50T</div>
              <div className="text-lg text-gray-300">
                CO2 Reduced (tons/year)
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">25</div>
              <div className="text-lg text-gray-300">Cities Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-lg text-gray-300">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
