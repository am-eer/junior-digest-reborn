export default function TeamPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-medium text-center mb-12">Our Team</h1>
            
            <section className="mb-12">
                <h2 className="text-2xl font-medium mb-4 border-b border-gray-300 pb-2">
                    EXECUTIVE EDITOR
                </h2>
                <p className="font-medium text-lg">Jose George</p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-medium mb-4 border-b border-gray-300 pb-2">
                    HONORARY EDITORIAL CONSULTANTS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                        <span className="font-medium">Ajitkumar N.</span>
                        <span className="text-text-secondary">Tax & Finance</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">B.A. Abdul Razak</span>
                        <span className="text-text-secondary">Education</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Prema K.P.</span>
                        <span className="text-text-secondary">Sanskrit</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Reji Charalayil</span>
                        <span className="text-text-secondary">Science</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Saji Poriyat</span>
                        <span className="text-text-secondary">Journalism</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Sethu Govind</span>
                        <span className="text-text-secondary">Pedagogy</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Adv. Tomy Thomas</span>
                        <span className="text-text-secondary">Law</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">C.C. JOSEPH</span>
                        <span className="text-text-secondary">Govt. Policy</span>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-medium mb-4 border-b border-gray-300 pb-2">
                    PROMOTER
                </h2>
                <div className="space-y-2">
                    <p className="font-medium text-lg">MEDHA SANDAYINEE SAMITY(Trust)</p>
                    <p>Reg.No. 42/2009</p>
                    <p>Chirakadavu Centre P.O.</p>
                    <p>Kottayam District</p>
                    <p>Kerala - 686519</p>
                    <p>Email: <a href="mailto:medhasamity@gmail.com" className="hover:underline">medhasamity@gmail.com</a></p>
                    <p className="mt-4 text-text-secondary">
                        MEDHA SANDAYINEE SAMITY(Trust) is a registered trust working since 2009 to improve the quality of school education.
                    </p>
                </div>
            </section>
        </main>
    );
}