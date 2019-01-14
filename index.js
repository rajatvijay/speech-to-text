async function main() {
  // Imports the Google Cloud client library
  const speech = require("@google-cloud/speech").v1p1beta1;
  const fs = require("fs");
  const language = require("@google-cloud/language");

  // Creates a client
  const client = new speech.SpeechClient();

  // Phone Call
  // const gsURL = "gs://sikka-fintech-cdn/phone_call.flac";

  // 001.raw
  // const gsURL = "gs://sikka-fintech-cdn/Speech-to-text/001.raw";

  // 000.raw
  // const gsURL = "gs://sikka-fintech-cdn/Speech-to-text/000.raw";

  // Lets Call complete
  // const gsURL =
  //   "gs://sikka-fintech-cdn/Speech-to-text/LetsGoPublic-20160101-000-input.raw";

  // Ashish's recording
  const gsURL = "gs://sikka-fintech-cdn/Speech-to-text/vk2yf-672x3.flac";

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    // content: audioBytes
    uri: gsURL
  };
  const config = {
    // encoding: "LINEAR16",
    // sampleRateHertz: 8000,
    maxAlternatives: 10,
    languageCode: "en-US",
    enableWordConfidence: true,
    enableAutomaticPunctuation: true,
    enableSpeakerDiarization: true, //TODO: See why this is not working!
    diarizationSpeakerCount: 2,
    model: `phone_call`,
    useEnhanced: true
    // audioChannelCount: 2,
    // enableSeparateRecognitionPerChannel: true
  };
  const request = {
    audio: audio,
    config: config
  };

  const [audioRecognitionResponse] = await client
    .longRunningRecognize(request)
    .then(data => data[0].promise());

  console.log(JSON.stringify(audioRecognitionResponse, null, 4));

  console.log(`Results: ${audioRecognitionResponse.results.length}`);
  console.log(
    `Alternatives: ${audioRecognitionResponse.results[0].alternatives.length}`
  );

  const { alternatives } = audioRecognitionResponse.results[0];

  alternatives.forEach((alternative, index) => {
    const { transcript, confidence } = alternative;
    console.log(
      `\nTranscript ${index + 1}:\n${transcript}\nConfidence ${index +
        1}:\n${confidence}\n`
    );
  });

  // audioRecognitionResponse.results.forEach(r => {
  //   const { alternatives } = r;

  //   // N Possibilities with confidence
  //   // alternatives.forEach((alternative, index) => {
  //   //   const { transcript, confidence } = alternative;
  //   //   console.log(
  //   //     `\nTranscript ${index + 1}:\n${transcript}\nConfidence ${index +
  //   //       1}:\n${confidence}\n`
  //   //   );
  //   // });

  //   // Speaker Diarization
  //   const { words } = alternatives[0];
  //   const classifiedWords = words.reduce(
  //     (acc, word) => {
  //       if (word.speakerTag === 1) {
  //         acc.speaker1 = acc.speaker1 + word.word + " ";
  //       } else {
  //         acc.speaker2 = acc.speaker2 + word.word + " ";
  //       }
  //       return acc;
  //     },
  //     { speaker1: "", speaker2: "" }
  //   );
  //   console.log("\nDiarization\n");
  //   console.log(JSON.stringify(classifiedWords, null, 4));

  //   const nplClient = new language.LanguageServiceClient();

  //   if (classifiedWords.speaker1) {
  //     nplClient
  //       .analyzeSentiment({
  //         document: {
  //           content: classifiedWords.speaker1,
  //           type: "PLAIN_TEXT"
  //         }
  //       })
  //       .then(results => {
  //         const sentiment = results[0].documentSentiment;
  //         console.log(`Sentiment Score Speaker 1: ${sentiment.score}`);
  //         console.log(
  //           `Sentiment Magnitude Speaker 1: ${sentiment.magnitude} \n\n`
  //         );
  //       })
  //       .catch(err => {
  //         console.error("ERROR:", err);
  //       });
  //   }

  //   if (classifiedWords.speaker2) {
  //     nplClient
  //       .analyzeSentiment({
  //         document: {
  //           content: classifiedWords.speaker2,
  //           type: "PLAIN_TEXT"
  //         }
  //       })
  //       .then(results => {
  //         const sentiment = results[0].documentSentiment;
  //         console.log(`Sentiment Score Speaker 2: ${sentiment.score}`);
  //         console.log(`Sentiment Magnitude Speaker 2: ${sentiment.magnitude}`);
  //       })
  //       .catch(err => {
  //         console.error("ERROR:", err);
  //       });
  //   }
  // });

  // alternatives.forEach(alternative => {});

  // const classifiedWords = words.reduce(
  //   (acc, word) => {
  //     if (word.speakerTag === 1) {
  //       acc.speaker1 = acc.speaker1 + word.word + " ";
  //     } else {
  //       acc.speaker2 = acc.speaker2 + word.word + " ";
  //     }
  //     return acc;
  //   },
  //   { speaker1: "", speaker2: "" }
  // );
  // console.log(JSON.stringify(classifiedWords, null, 4));

  // const transcription = audioRecognitionResponse.results
  //   .map(result => result.alternatives[0].transcript)
  //   // .map(result => result.alternatives.map(a => a.transcript).join("\n"))
  //   .join("\n");
  // console.log(`Transcription: ${transcription}`);

  // TODO: Uncomment this for category analysis

  // const nlpDocument = {
  //   content: transcription,
  //   type: "PLAIN_TEXT"
  // };

  // const [nlpResponse] = await nplClient.analyzeEntities({
  //   document: nlpDocument
  // });
  // const entities = nlpResponse.entities;

  // console.log("Entities:");
  // entities.forEach(entity => {
  //   console.log(entity.name);
  //   console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
  //   if (entity.metadata && entity.metadata.wikipedia_url) {
  //     console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`);
  //   }
  // });

  // const [classificationResponse] = await nplClient.classifyText({
  //   document: nlpDocument
  // });
  // const categories = classificationResponse.categories;

  // console.log("Categories:");
  // categories.forEach(category => {
  //   console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);
  // });
  // TODO: Sentiment Analysis

  // nplClient
  //   .analyzeSentiment({ document: document })
  //   .then(results => {
  //     const sentiment = results[0].documentSentiment;
  //     console.log("result", results[0]);

  //     console.log(`Text: ${transcription}`);
  //     console.log(`Sentiment score: ${sentiment.score}`);
  //     console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  //   })
  //   .catch(err => {
  //     console.error("ERROR:", err);
  //   });
  // console.log(err);

  //   client
  //     .longRunningRecognize(request)
  //     .then(data => {
  //       const operation = data[0];
  //       // Get a Promise representation of the final result of the job
  //       return operation.promise();
  //     })
  //     .then(data => {
  //       const response = data[0];
  //       const transcription = response.results
  //         .map(result => result.alternatives[0].transcript)
  //         .join("\n");
  //       console.log(`Transcription: ${transcription}`);

  //       const confidence = response.results
  //         .map(result => result.alternatives[0].confidence)
  //         .join(`\n`);
  //       console.log(`Confindence: ${confidence}`);

  //       const result = response.results[response.results.length - 1];
  //       //   console.log(result);
  //       const wordsInfo = result.alternatives[0].words;
  //       // Note: The transcript within each result is separate and sequential per result.
  //       // However, the words list within an alternative includes all the words
  //       // from all the results thus far. Thus, to get all the words with speaker
  //       // tags, you only have to take the words list from the last result:
  //       wordsInfo.forEach(a =>
  //         console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`)
  //       );
  //     })
  // .catch(err => {
  //   console.error("ERROR:", err);
  // });
}
main().catch(console.error);
