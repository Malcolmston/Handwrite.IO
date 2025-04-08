import "./style/darkmode.css"
import "./style/tab.css"
import { TabHooks } from './Tab'; // Import the functional component version
import ThemeToggle from "./Toggle/useTheme"

function Home() {


    // Define the tabs configuration
    const tabs = [
        {
            id: 'a',
            label: 'Our mission',
            content: (
                <>
                    <h3>Our mission</h3>
                    <p>Welcome to Handwrite, a tool to help students with learning-based disabilities.</p>
                    <p>This tool works by converting text from images on any device and scribes them for students to read.</p>
                    <p>The tool uses AI to help with reading comprehension but also spelling by taking text and summarizing,
                        improving, or any other text-based suggestions you might need.</p>
                    <p>This tool also uses text-to-speech models to make the given text as human-like as possible.</p>
                    <p>All fonts are chosen specifically as dyslexic-friendly fonts as well as text color for whatever your needs
                        are.</p>
                    <p>All of this is done on the client side to protect your privacy and data.</p>
                    <p>We also offer in-text translation, converting your text to a wide array of other languages.</p>
                    <p>We also offer a wide range of text-to-speech models to choose from.</p>
                </>
            )
        },
        {
            id: 'b',
            label: 'Why us',
            content: (
                <>
                    <h3>Why choose us</h3>
                    <p>We are a small team of 2 that wanted to make a difference in the world and help those who need it most.</p>
                    <p>We offer a unique tool to help those with learning disabilities to make their school and life endeavors as
                        simple as possible.</p>
                    <p>We are also open to any suggestions you might have to make this tool better for you.</p>
                    <p>We serve schools, as well as individuals, creating a space where people can read with their phone.</p>
                </>
            )
        },
        {
            id: 'c',
            label: 'About',
            content: (
                <>
                    <h3>About</h3>
                    <p>Hello, my name is Malcolm Stone the creator of HandWrite.IO</p>
                    <p>People often ask me why I created Handwrite.io. Well as a college student with dyslexia, all throughout school
                        I often struggled with spelling, reading, and typing.</p>
                    <p>So I wanted to make a tool that would help me and others like me to make school and life easier.</p>
                    <p>I also wanted to make a tool that would help people with learning disabilities to feel more included in the
                        world.</p>
                    <p>So I created Handwrite.IO, an AI tool to make spelling easier.</p>
                </>
            )
        },
        {
            id: 'd',
            label: 'FAQ',
            content: (
                <>
                    <h3>FAQ</h3>
                    <p>Q: How do I use this tool?</p>
                    <p>A: It's simple, just take a picture of the text you want to convert and upload it to the website or the app.
                        The AI will do the rest.</p>

                    <p>Q: Do you serve schools?</p>
                    <p>A: Our tool offers competitive prices for schooling, allowing schools of any size to use both the app and
                        website.</p>

                    <p>Q: What grades is this service best suited for?</p>
                    <p>A: We have found that this tool is best suited for elementary and middle school students, but can be used by
                        anyone who needs it.</p>
                </>
            )
        },
        {
            id: 'e',
            label: 'Privacy',
            content: (
                <>
                    <h3>Privacy</h3>
                    <p>We here at Handwrite.IO take our users' privacy very seriously.</p>
                    <p>We do not store any of your data or images on our servers, all processing is done on the client side.</p>
                    <p>We do not share or sell your data to any third parties.</p>
                    <p>You can read more about our privacy policy <a href="/privacy.ejs">here</a>.</p>
                    <p>If you have any questions or concerns, please feel free to contact us at <a
                        href="mailto:malcolmstone11@gmail.com">malcolmstone11@gmail.com</a>.</p>
                </>
            )
        },
        {
            id: 'pricing',
            label: 'Pricing',
            isExternal: true,
            link: '/pricing',
            icon: 'fa-solid fa-arrow-up-right-from-square'
        }
    ];

    // Handle tab change event
    const handleTabChange = (tabId) => {
        console.log(`Tab changed to: ${tabId}`);
        // You can add analytics or other functionality here
    };

    return (
        <div className="head">
            <div className="header">
                <ThemeToggle/>
            </div>

            <TabHooks
                tabs={tabs}
                storageKey="handwrite-tabs"
                externalLinks={true}
                onTabChange={handleTabChange}
                className="main-tabs"
            />
        </div>
    );
}

export default Home;
