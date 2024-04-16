## Frontend Features
1) Tabbed Information in logical units.
2) Quantitative performance overview.
3) Performance comparision with peers.
4) Self Benchmarking from past performance.
5) Quick Suggestion snippets: 15 words or less.
6) Detailed description of goods & bads in current performance.
7) Detailed AI suggestion based on skill segments.
8) Real-time, visually intuitive audio listening capability for users iwth limited hearing capability.
9) Custom Audio PLayer with navigational ausio controls.
10) Handy AI suggestions while listening to the audio.

## Design Ideology: Reasons for designing the way I did!

1) I want to display information in a logical order where all info seems connected but logically independent. How?
    - All information is broken down into skill segments based on the skills related to the interview (Algorithms, Communication, etc.).
    - I use 4 tabs to organize info in logical units. (Vertical Pillars)
        -> Overview tab gives basic overview of current performnace.
        -> Past Performance Tab compares current performance with average of past performances. This helps user analyse trend in their performance.
        -> AI Suggests tab gives description of their performance and suggests improvemnts if any or accomplishments if any.
        -> Finally, the audio is broken into segments so that users do not have to listen to long audios. They can interact with the audio and also get its transcripts which is important for users with limited hearing capabilities.

2) I want to break the the information into layers starting with the most abstract information and diving into specifics. (Horizontal Pillars)
    - Overview Tab: Break analysis into skill segments.
    - AI Suggests Tab: Firstly, display 1 line AI suggestion to the user to give them a quick suggestion. If the user wants to dive deeper then each accordion describes their performance, highlights their strengths & weaknesses and also shows a detailed suggestion from AI.

3) I want the user to get wholesome & comprehensive review but at the same time not demand much time of the user..
    - I have used differnet visualization techniques to summarize user performance. 
    - Display them in self explanatory charts for users to get 1 look information.
    - Provide quick information and them dive deeper into that information based on user's choice.

4) Minimize the text and make things as intuitive as possible.
    - The use of icons, tabs and charts present vital info with minimal text.
    - Audio Drawers make the audio listening fun with a lively transcript that feels like it is being typed. It gives a feel that the user is listening to a live speaker while reading live text.


## Backend + API Security Considerations 