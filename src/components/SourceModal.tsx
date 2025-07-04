import React from 'react';
import { X, ExternalLink, Shield, AlertTriangle, Building } from 'lucide-react';

interface SourceModalProps {
  source: any;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ source, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Source Profile</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{source.source}</h4>
              <p className="text-gray-300 text-sm">News Organization</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-400" />
                <h5 className="font-medium text-white">Factuality Score</h5>
              </div>
              <div className="text-2xl font-bold text-white">{source.factuality}/10</div>
              <p className="text-sm text-gray-300 mt-1">
                {source.factuality >= 8 ? 'Highly Reliable' : 
                 source.factuality >= 6 ? 'Moderately Reliable' : 'Less Reliable'}
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h5 className="font-medium text-white">Bias Rating</h5>
              </div>
              <div className="text-2xl font-bold text-white capitalize">{source.bias}</div>
              <p className="text-sm text-gray-300 mt-1">Political Lean</p>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
            <h5 className="font-medium text-white mb-3">Latest Headlines</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{source.headline}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
            <h5 className="font-medium text-white mb-3">Ownership Information</h5>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Owner: Independent Media Group</div>
              <div>Founded: 1995</div>
              <div>Headquarters: New York, NY</div>
              <div>Political Funding: Mixed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};