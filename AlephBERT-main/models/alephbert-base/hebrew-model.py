from transformers import BertForMaskedLM, BertTokenizerFast
import torch
import pickle
import io
import sys

torch.device('cpu')

class CPU_Unpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == 'torch.storage' and name == '_load_from_bytes':
            return lambda b: torch.load(io.BytesIO(b), map_location='cpu')
        else: return super().find_class(module, name)

alephbert_tokenizer = BertTokenizerFast.from_pretrained('onlplab/alephbert-base')
alephbert = CPU_Unpickler(open('../AlephBERT-main/models/myFirstTune/tune_2.pkl', 'rb')).load()
# alephbert = CPU_Unpickler(open('../../models/myFirstTune/tune_2.pkl', 'rb')).load()

text = sys.argv[1]
mask = sys.argv[2]

text = text.replace(mask, '[MASK]')
hebrew_text = '[CLS] ' + text + ' . [SEP]'

tokenized_text = alephbert_tokenizer.tokenize(hebrew_text)
indexed_tokens = alephbert_tokenizer.convert_tokens_to_ids(tokenized_text)


# Create the segments tensors.
segments_ids = [0] * len(tokenized_text)

# Convert inputs to PyTorch tensors
tokens_tensor = torch.tensor([indexed_tokens])

segments_tensors = torch.tensor([segments_ids])

# Load pre-trained model (weights)
alephbert.eval()

# Predict all tokens
with torch.no_grad():
    predictions = alephbert(tokens_tensor, segments_tensors)

masked_index = tokenized_text.index('[MASK]')

predicted_sorted = torch.argsort(predictions[0][0, masked_index], descending=True)


print(alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted[:20]]))