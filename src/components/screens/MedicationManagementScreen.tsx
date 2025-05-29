
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Pill } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MedicationManagementScreen = () => {
  const [medications, setMedications] = useState([
    { id: '1', name: 'ロキソニン錠60mg', standardDose: '1', unit: '錠', memo: '痛み止め・食後に服用' },
    { id: '2', name: 'ガスター錠20mg', standardDose: '1', unit: '錠', memo: '胃薬・空腹時でも可' },
    { id: '3', name: 'ムコダイン錠250mg', standardDose: '3', unit: '錠', memo: '去痰薬・水分を多めに摂取' },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    standardDose: '',
    unit: '',
    memo: ''
  });
  
  const { toast } = useToast();

  const handleOpenDialog = (medication = null) => {
    if (medication) {
      setEditingMedication(medication);
      setFormData(medication);
    } else {
      setEditingMedication(null);
      setFormData({ name: '', standardDose: '', unit: '', memo: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMedication(null);
    setFormData({ name: '', standardDose: '', unit: '', memo: '' });
  };

  const handleSave = () => {
    if (!formData.name || !formData.standardDose || !formData.unit) {
      toast({
        title: "エラー",
        description: "薬剤名、標準服用量、単位は必須項目です。",
        variant: "destructive",
      });
      return;
    }

    if (editingMedication) {
      // 編集
      setMedications(prev => prev.map(med => 
        med.id === editingMedication.id 
          ? { ...med, ...formData }
          : med
      ));
      toast({
        title: "更新完了",
        description: "薬剤情報を更新しました。",
      });
    } else {
      // 新規登録
      const newMedication = {
        id: Date.now().toString(),
        ...formData
      };
      setMedications(prev => [...prev, newMedication]);
      toast({
        title: "登録完了",
        description: "新しい薬剤を登録しました。",
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (medicationId: string) => {
    setMedications(prev => prev.filter(med => med.id !== medicationId));
    toast({
      title: "削除完了",
      description: "薬剤情報を削除しました。",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">薬剤管理</h2>
        <p className="text-gray-600">登録されている薬剤の管理ができます</p>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Pill className="w-5 h-5" />
            登録済み薬剤
          </CardTitle>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                新しい薬を登録
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-indigo-500" />
                  {editingMedication ? '薬剤情報編集' : '新しい薬剤登録'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medicationName" className="text-sm font-medium text-gray-700">
                    薬剤名 *
                  </Label>
                  <Input
                    id="medicationName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例：ロキソニン錠60mg"
                    className="mt-1 border-indigo-200 focus:border-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="standardDose" className="text-sm font-medium text-gray-700">
                      標準服用量 *
                    </Label>
                    <Input
                      id="standardDose"
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.standardDose}
                      onChange={(e) => setFormData(prev => ({ ...prev, standardDose: e.target.value }))}
                      placeholder="1"
                      className="mt-1 border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
                      単位 *
                    </Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="錠"
                      className="mt-1 border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="medicationMemo" className="text-sm font-medium text-gray-700">
                    メモ（任意）
                  </Label>
                  <Textarea
                    id="medicationMemo"
                    value={formData.memo}
                    onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                    placeholder="薬剤に関するメモがあれば記入してください"
                    className="mt-1 resize-none border-indigo-200 focus:border-indigo-500"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={handleSave} 
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    保存
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCloseDialog} 
                    className="flex-1 hover:bg-gray-50"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {medications.map((medication) => (
              <Card key={medication.id} className="p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-indigo-400 bg-gradient-to-r from-white to-indigo-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-800 text-lg">
                        {medication.name}
                      </h3>
                      <Badge variant="outline" className="text-xs bg-indigo-100 text-indigo-700 border-indigo-200">
                        {medication.standardDose} {medication.unit}
                      </Badge>
                    </div>
                    
                    {medication.memo && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        {medication.memo}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(medication)}
                      className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      編集
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(medication.id)}
                      className="hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      削除
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {medications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>登録されている薬剤がありません。</p>
                <p className="text-sm">「新しい薬を登録」ボタンから薬剤を追加してください。</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
