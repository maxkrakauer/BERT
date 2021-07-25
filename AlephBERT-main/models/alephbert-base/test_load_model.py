from transformers import BertForMaskedLM, BertTokenizerFast

alephbert_tokenizer = BertTokenizerFast.from_pretrained('onlplab/alephbert-base')
alephbert = BertForMaskedLM.from_pretrained('onlplab/alephbert-base')
# if not finetuning - disable dropout


import torch

hebrew_text = '[CLS] לכולם שלום [MASK] מאוד . [SEP]'

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

predicted_index = torch.argmax(predictions[0][0,masked_index]).item()

predicted_sorted = torch.argsort(predictions[0, masked_index], descending=True)

predicted_token = alephbert_tokenizer.convert_ids_to_tokens([predicted_index])[0]

print(predicted_token)
# print(alephbert_tokenizer.convert_ids_to_tokens([token.item() for token in predicted_sorted[:20]]))
print([token.item() for token in predicted_sorted[:20]])
print(hebrew_text)