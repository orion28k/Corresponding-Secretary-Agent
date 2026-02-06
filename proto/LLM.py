import google.generativeai as genai
import os

class LLM:
    def __init__(self, systemInstructions:str):
        #LLM
        try:
            with open ("/Users/andred/Desktop/Computer_Science/Projects/MyAI-Files/MyAI-Gmail/llm_key.txt", "r") as f: # REPLACE WITH YOUR LLM GEMINI API KEY
                genai.configure(api_key=f.read()) 
        except:
            print("LLM API key invalid. Make sure you changed the file's location and the file has your LLM key.")
            os._exit(0)

        llm_model = genai.GenerativeModel(model_name="gemini-2.5-flash", system_instruction=systemInstructions)

        self.llm_model = llm_model

    def respond(self, prompt_text:str, log_file:str = None, image_path:str = None):
        """
        Generates a response from the Gemini model based on the given prompt text.
        Prints and returns the model's response.
        """

        '''
        extenstion = "jpeg"
        image_bytes = None
        
        if image_path:
            with open(image_path, "rb") as f:
                image_bytes = f.read()
            
            if image_path.split(".", 1)[1] != "jpg":
                extenstion = image_path.split(".", 1)[1] 

            with open(log_file, "r") as log:
                contents = [
                    {
                        "role": "user",
                        "parts": [
                            {"inline_data": {
                                "mime_type": f"image/{extenstion}",
                                "data": image_bytes
                            }},
                            {"text": log.read() + "\n" + prompt_text}
                        ]
                    }
                ]
                logging.info("LLM LOG: Image detected in input")
        else:
            with open(log_file, "r") as log:
                contents = [
                    {
                        "role": "user",
                        "parts": [
                            {"text": log.read() + "\n" + prompt_text}
                        ]
                    }
                ]
        '''

        contents = [
            {
                "role": "user",
                "parts": [
                    {"text":prompt_text}
                ]
            }
        ]

        response = self.llm_model.generate_content(contents=contents)
        print(f"LLM: '{response.text}'")
        return response.text