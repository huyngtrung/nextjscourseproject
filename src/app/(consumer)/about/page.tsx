'use client';
import Image from 'next/image';

export default function AboutPage() {
    const memberImages = [
        'member1.jpg',
        'member2.jpg',
        'member3.jpg',
        'member4.jpg',
        'member5.jpg',
        'member6.jpg',
        'member7.jpg',
    ];

    return (
        <div>
            <div className="container my-24 lg:px-12 px-4 flex flex-col lg:flex-row gap-16 items-start pb-4">
                <div className="w-full lg:w-1/2 flex items-center text-justify">
                    <p>
                        <span className="font-bold text-3xl">The D0F DigiCademy Story</span>
                        <br />
                        <br />
                        <span className="font-bold">The Journey Begins, </span>every great
                        achievement starts with a single step. D0F Digicademy was born from a simple
                        but powerful idea: learning should be accessible, inspiring, and
                        transformative. In a world where knowledge is the new currency, too many
                        people still struggle to find affordable, high-quality education. Our
                        founders, a group of passionate educators and tech enthusiasts, saw an
                        opportunity to bridge that gap by creating an online platform where learners
                        from all walks of life could access professional courses without the
                        limitations of location or traditional schedules.
                        <br />
                        <br />
                        <span className="font-bold">Our Vision, </span>from the very beginning, our
                        vision has been to empower individuals to take control of their learning
                        journey. We believe education is not just about acquiring skills — it’s
                        about unlocking potential, sparking curiosity, and building confidence.
                        Whether someone is looking to advance their career, start a new business, or
                        simply explore a personal interest, D0F Digicademy is here to provide the
                        tools and guidance they need.
                        <br />
                        <br />
                        <span className="font-bold">How We Built It, </span>we started small,
                        offering just a handful of courses in digital skills, business, and creative
                        arts. But with each learner who joined our community, we grew stronger. We
                        listened to feedback, improved our content, and expanded our library to
                        include hundreds of courses across multiple categories. Our platform now
                        features lessons from industry experts, interactive learning tools, and
                        personalized progress tracking — all designed to help students achieve their
                        goals faster.
                        <br />
                        <br />
                        <span className="font-bold">What Makes Us Different, </span>many online
                        learning platforms focus solely on delivering content. We go beyond that. At
                        D0F Digicademy, we believe in creating a complete learning experience. This
                        means offering mentorship opportunities, community discussions, and
                        real-world projects that allow learners to apply what they’ve learned. Our
                        courses are updated regularly to stay relevant with industry trends, and we
                        ensure that the knowledge gained here has practical, lasting value.
                        <br />
                        <br />
                        <strong>Looking Ahead, </strong>the journey of D0F Digicademy is still
                        unfolding. We are continuously innovating — experimenting with new learning
                        technologies, expanding our subject areas, and forming partnerships with
                        organizations worldwide. Our mission remains clear: to make high-quality
                        education available to anyone, anywhere. We see a future where millions of
                        learners find their passion, change their careers, and improve their lives
                        through the opportunities we create.
                        <br />
                        <br />
                        <strong>A Community of Lifelong Learners, </strong>today D0F Digicademy is
                        more than just a website. It’s a vibrant community of dreamers, doers, and
                        thinkers. Every success story from our learners inspires us to work harder
                        and dream bigger. We invite you to be part of this journey — not just to
                        learn, but to grow, share, and contribute. Together, we can make education
                        more accessible, meaningful, and exciting than ever before.
                    </p>
                </div>
                <div className="w-full lg:w-1/2 flex-row flex gap-2 lg:gap-4 justify-between sticky top-16 self-start">
                    <div className="flex-1">
                        <Image
                            src="/imgs/about/aboutStory1.jpg"
                            alt="About"
                            className="w-full h-auto max-w-[20rem] object-cover rounded-lg"
                            width={400}
                            height={300}
                        />
                    </div>
                    <div className="flex-1 mt-8">
                        <Image
                            src="/imgs/about/aboutStory2.jpg"
                            alt="About"
                            className="w-full h-auto max-w-[20rem] object-cover rounded-lg"
                            width={400}
                            height={300}
                        />
                    </div>
                </div>
            </div>
            <div className="container lg:px-12 px-4 flex flex-col lg:flex-row gap-16 items-start py-20 bg-amber-300">
                <div className="w-full lg:w-1/3 flex items-center text-justify lg:sticky lg:top-16 lg:self-start ">
                    <p>
                        <span className="font-bold text-3xl">
                            Improving Skills, Improving Job opportunities: Meet Our Team
                        </span>
                        <br />
                        <br />
                        <strong>Our Team, </strong>is composed of passionate IT educators and
                        industry professionals who are dedicated to helping learners achieve their
                        goals.
                        <br />
                        <br />
                        We believe that everyone deserves access to top-notch education, and that is
                        why we have built a platform that makes IT skills approachable, engaging,
                        and effective. But we know that mastering technology is just one step in
                        personal and professional growth, which is why our instructors focus on
                        developing well-rounded skills, problem-solving abilities, and critical
                        thinking alongside technical knowledge. Our team is constantly researching
                        emerging trends and creating new courses to keep learners ahead in the
                        fast-paced tech industry.
                        <br />
                        <br />
                        At D0F Digicademy, we are not just creating courses — we are building a
                        community of learners and educators who support one another, share insights,
                        and grow together. We are proud to be part of this mission and are excited
                        to help learners worldwide develop the skills, confidence, and knowledge
                        they need to succeed in the ever-evolving field of technology.
                    </p>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 lg:grid-cols-3 gap-4 ">
                    {memberImages.map((img, index) => (
                        <div key={index} className="mx-auto lg:mx-0">
                            <Image
                                src={`/imgs/about/member/${img}`}
                                alt="About"
                                className="w-full h-auto max-w-[16rem] max-h-[16rem] object-cover rounded-lg"
                                width={400}
                                height={240}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
