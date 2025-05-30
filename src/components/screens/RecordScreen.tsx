
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Clock, Pill, Check } from 'lucide-react';

export const RecordScreen = () => {
  const { toast } = useToast();
  
  // 現在時刻を取得してフォーマット
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:MM形式
  };

  const [medicationTime, setMedicationTime] = useState(getCurrentTime());
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [memo, setMemo] = useState('');

  // コンポーネントマウント時に現在時刻をセット
  useEffect(() => {
    setMedicationTime(getCurrentTime());
  }, []);

  // サンプル薬剤データ（薬剤管理画面から取得想定）
  const availableMedications = [
    { 
      id: '1', 
      name: 'ロキソニン錠60mg', 
      dosage: '1錠',
      memo: '朝食後に服用。胃の負担を軽減するため'
    },
    { 
      id: '2', 
      name: 'ガスター錠20mg', 
      dosage: '1錠',
      memo: '胃の保護のため。空腹時でも可'
    },
    { 
      id: '3', 
      name: 'ムコダイン錠250mg', 
      dosage: '2錠',
      memo: '水分多めに摂取。のどの痰を出しやすくする'
    },
    { 
      id: '4', 
      name: 'ビタミンC錠200mg', 
      dosage: '1錠',
      memo: ''
    }
  ];

  const handleMedicationToggle = (medicationId: string) => {
    setSelectedMedications(prev => 
      prev.includes(medicationId) 
        ? prev.filter(id => id !== medicationId)
        : [...prev, medicationId]
    );
  };

  const handleSubmit = () => {
    if (selectedMedications.length === 0) {
      toast({
        title: "エラー",
        description: "服用する薬剤を選択してください。",
        variant: "destructive",
      });
      return;
    }

    const selectedMeds = availableMedications.filter(med => 
      selectedMedications.includes(med.id)
    );

    toast({
      title: "記録完了",
      description: `${medicationTime} に ${selectedMeds.map(med => med.name).join(', ')} を記録しました。`,
    });

    // フォームリセット
    setSelectedMedications([]);
    setMemo('');
    setMedicationTime(getCurrentTime());
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">服薬記録</h2>
        <p className="text-sm sm:text-base text-gray-600">今日の服薬状況を記録しましょう</p>
      </div>

      {/* 服用時刻設定 */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            服用時刻
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Label htmlFor="medicationTime" className="text-sm font-medium text-gray-700 mb-2 block">
            服用時刻を選択
          </Label>
          <Input
            id="medicationTime"
            type="time"
            value={medicationTime}
            onChange={(e) => setMedicationTime(e.target.value)}
            className="border-blue-200 focus:border-blue-500"
          />
        </CardContent>
      </Card>

      {/* 服用薬選択 */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Pill className="w-4 h-4 sm:w-5 sm:h-5" />
            服用薬選択
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-3 sm:gap-4">
            {availableMedications.map((medication) => (
              <div
                key={medication.id}
                className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedMedications.includes(medication.id)
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => handleMedicationToggle(medication.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedMedications.includes(medication.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedMedications.includes(medication.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">{medication.name}</h3>
                      <span className="text-blue-600 text-xs sm:text-sm font-medium">({medication.dosage})</span>
                    </div>
                    {medication.memo && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                        💡 {medication.memo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* メモ入力 */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-base sm:text-lg font-semibold">メモ（任意）</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Textarea
            placeholder="体調や服用時の状況など..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="resize-none border-blue-200 focus:border-blue-500"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* 記録ボタン */}
      <Button 
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg"
        disabled={selectedMedications.length === 0}
      >
        <Plus className="w-5 h-5 mr-2" />
        服薬記録を保存
      </Button>
    </div>
  );
};
