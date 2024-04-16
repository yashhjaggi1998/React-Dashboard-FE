Live link: https://smart-interview-review-dashboard-mock-ai.vercel.app/
## Frontend Features
1) Tabbed Information in logical units.
2) Quantitative performance overview.
3) Performance comparision with peers.
4) Self Benchmarking from past performance.
5) Quick Suggestion snippets: 15 words or less.
6) Detailed description of goods & bads for each skill segment.
7) Detailed AI suggestion based on skill segments.
8) Real-time, visually intuitive audio listening capability for users with limited hearing capability.
9) Custom Audio Player with navigational audio controls.
10) Handy AI suggestions while listening to the audio.

## Design Ideology: Reasons for designing the way I did!

1) I want to display information in a logical order where all info seems connected but logically independent. How?
    - All information is broken down into skill segments based on the skills related to the interview (Algorithms, Communication, etc.).
    - I use 4 tabs to organize info in logical units. (Vertical Pillars)
        - Overview tab gives basic overview of current performnace.
        - Past Performance Tab compares current performance with average of past performances. This helps user analyse trend in their performance.
        - AI Suggests tab gives description of their performance and suggests improvemnts if any or accomplishments if any.
        - Finally, the audio is broken into segments so that users do not have to listen to long audios. They can interact with the audio and also get its transcripts which is important for users with limited hearing capabilities.

2) I want to break the the information into layers starting with the most abstract information and diving into specifics. (Horizontal Pillars)
    - Overview Tab: Break analysis into skill segments.
    - AI Suggests Tab: Firstly, display 1 line AI suggestion to the user to give them a quick suggestion. If the user wants to dive deeper then each accordion describes their performance, highlights their strengths & weaknesses and also shows a detailed suggestion from AI.

3) I want the user to get wholesome & comprehensive review but at the same time not demand much time of the user..
    - I have used different visualization techniques to summarize user performance. 
    - Display them in self explanatory charts for users to get 1 look information.
    - Provide quick information and them dive deeper into that information based on user's choice.

4) Minimize the text and make things as intuitive as possible.
    - The use of icons, tabs and charts present vital info with minimal text.
    - Audio Drawers make the audio listening fun with a lively transcript that feels like it is being typed. It gives a feel that the user is listening to a live speaker while reading live text.


## Backend + API Security Considerations 

- API Endpoints:
    - fetch_interview_data [ GET HTTP API returns JSON ]: It fetches the interview data from the backend broken into various skill segments. 
    - fetch_audio_file [GET HTTP API returns audio stream from .wav]: It fetches the specific audio file from public folder and returns a binary data stream to be played on the frontend.
    - (Theoretical backend operation): Ideally, the application will make use of NLP techniques to break the whole interview audio into skill segments and store it in secure folder.

- API Security
    - Use of https protocol for secure transmission.
    - Store the audio files in a secured folder which is not accessible publicly. Ideally password protected folder.
    - Each API endpoint must have a basic authentication or oAuth authentiaction in place. So, without authorized credentials no one can access these API endpoints.
    - These endpoints must also support access control so, data can be protected at multiple levels and a user should only get the data they have access to and not highly confidential data.
    - Communicating with the user taht their data is being collected, processed and stored is very important as well.
