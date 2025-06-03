"use client";

import React, { useState } from "react";
import Input from "./Input";
import Textarea from "./Textarea";

interface QAItem {
  question: string;
  answer: string;
}

interface QAEditorProps {
  name: string;
  label: string;
  currentQA?: QAItem[];
  className?: string;
  required?: boolean;
}

const QAEditor: React.FC<QAEditorProps> = ({
  name,
  label,
  currentQA = [],
  className = "",
  required = false,
}) => {
  const [qaItems, setQAItems] = useState<QAItem[]>(currentQA);
  const [newQA, setNewQA] = useState({ question: "", answer: "" });
  const [error, setError] = useState<string | null>(null);

  const addQA = () => {
    if (!newQA.question.trim() || !newQA.answer.trim()) {
      setError("Por favor, completa tanto la pregunta como la respuesta");
      return;
    }

    const newItem: QAItem = {
      question: newQA.question.trim(),
      answer: newQA.answer.trim(),
    };

    setQAItems((prevItems) => [...prevItems, newItem]);
    setNewQA({ question: "", answer: "" });
    setError(null);
  };

  const removeQA = (index: number) => {
    setQAItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const updateQA = (index: number, field: keyof QAItem, value: string) => {
    setQAItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Agregar nueva pregunta y respuesta */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Agregar nueva pregunta
        </h4>

        <div className="space-y-3">
          <div>
            <Input
              label="Pregunta"
              type="text"
              placeholder="Escribe tu pregunta aquí..."
              value={newQA.question}
              onChange={(e) =>
                setNewQA((prev) => ({ ...prev, question: e.target.value }))
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <Textarea
              label="Respuesta"
              placeholder="Escribe la respuesta aquí..."
              value={newQA.answer}
              onChange={(e) =>
                setNewQA((prev) => ({ ...prev, answer: e.target.value }))
              }
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm px-3 py-2 border resize-none"
            />
          </div>

          <button
            type="button"
            onClick={addQA}
            className="px-4 py-2 bg-[#7A7CFF] text-white rounded-md hover:bg-[#6A6CFF] transition-colors text-sm"
          >
            Agregar Pregunta
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Lista de preguntas y respuestas */}
      {qaItems.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Preguntas y respuestas ({qaItems.length})
          </label>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {qaItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-md p-4 bg-white border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h5 className="text-sm font-medium text-gray-800">
                    Pregunta {index + 1}
                  </h5>
                  <button
                    type="button"
                    onClick={() => removeQA(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Eliminar pregunta"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Input
                      label="Pregunta"
                      type="text"
                      value={item.question}
                      onChange={(e) =>
                        updateQA(index, "question", e.target.value)
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm px-3 py-2 border"
                    />
                  </div>

                  <div>
                    <Textarea
                      label="Respuesta"
                      value={item.answer}
                      onChange={(e) =>
                        updateQA(index, "answer", e.target.value)
                      }
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#7A7CFF] focus:ring-[#7A7CFF] sm:text-sm px-3 py-2 border resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input oculto para enviar las Q&A como JSON */}
      <input type="hidden" name={name} value={JSON.stringify(qaItems)} />
    </div>
  );
};

export default QAEditor;
